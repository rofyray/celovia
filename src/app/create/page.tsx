"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import TemplateSelect from "@/components/create/TemplateSelect";
import { getTemplate } from "@/lib/templates";
import type { TemplateId, Memory, StyleConfig, GeneratedMessage } from "@/types";

const PersonalDetails = dynamic(() => import("@/components/create/PersonalDetails"));
const StyleCustomization = dynamic(() => import("@/components/create/StyleCustomization"));
const PreviewGenerate = dynamic(() => import("@/components/create/PreviewGenerate"));
const ShareStep = dynamic(() => import("@/components/create/ShareStep"));

const STEPS = ["Template", "Details", "Style", "Preview", "Share"];

export default function CreatePage() {
  const [step, setStep] = useState(0);
  const [templateId, setTemplateId] = useState<TemplateId>("classic");
  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [memories, setMemories] = useState<Memory[]>([
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
  ]);
  const [hints, setHints] = useState("");
  const [styleConfig, setStyleConfig] = useState<StyleConfig>(
    getTemplate("classic").defaultStyle
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generatedMessage, setGeneratedMessage] =
    useState<GeneratedMessage | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const handleTemplateSelect = (id: TemplateId) => {
    setTemplateId(id);
    setStyleConfig(getTemplate(id).defaultStyle);
  };

  const handleMemoryChange = (
    index: number,
    field: keyof Memory,
    value: string
  ) => {
    const updated = [...memories];
    updated[index] = { ...updated[index], [field]: value };
    setMemories(updated);
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!senderName.trim()) newErrors.senderName = "Your name is required";
      if (!recipientName.trim())
        newErrors.recipientName = "Their name is required";

      const filledMemories = memories.filter(
        (m) => m.title.trim() || m.description.trim()
      );
      if (filledMemories.length === 0) {
        newErrors.memory_0 = "At least one memory is required";
      }
      filledMemories.forEach((m, i) => {
        if (m.title.trim() && !m.description.trim()) {
          newErrors[`memory_${i}`] = "Description is required";
        }
        if (!m.title.trim() && m.description.trim()) {
          newErrors[`memory_${i}`] = "Title is required";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const getFilledMemories = () =>
    memories.filter((m) => m.title.trim() && m.description.trim());

  const generateMessage = async () => {
    const res = await fetch("/api/generate-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderName,
        recipientName,
        templateId,
        memories: getFilledMemories(),
        hints: hints || undefined,
      }),
    });
    if (!res.ok) throw new Error("Failed to generate message");
    return (await res.json()) as GeneratedMessage;
  };

  const generateImage = async (tagline?: string) => {
    const res = await fetch("/api/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        templateId,
        senderName,
        recipientName,
        tagline,
      }),
    });
    if (!res.ok) throw new Error("Failed to generate image");
    const data = await res.json();
    return data.imageUrl as string;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const [message, imageUrl] = await Promise.all([
        generateMessage(),
        generateImage(),
      ]);
      setGeneratedMessage(message);
      setGeneratedImageUrl(imageUrl);
    } catch (err) {
      console.error("Generation failed:", err);
      // Try message-only if both fail
      try {
        const message = await generateMessage();
        setGeneratedMessage(message);
      } catch {
        setErrors({ generate: "Failed to generate. Please try again." });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateMessage = async () => {
    setIsGenerating(true);
    try {
      const message = await generateMessage();
      setGeneratedMessage(message);
    } catch {
      // Keep existing message
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateImage = async () => {
    setIsGenerating(true);
    try {
      const imageUrl = await generateImage(generatedMessage?.tagline);
      setGeneratedImageUrl(imageUrl);
    } catch {
      // Keep existing image
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderName,
          recipientName,
          templateId,
          memories: getFilledMemories(),
          hints: hints || undefined,
          styleConfig,
          generatedMessage,
          generatedImageUrl,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const data = await res.json();
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
      setShareUrl(`${baseUrl}/v/${data.accessToken}`);
    } catch {
      setErrors({ save: "Failed to save. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-4 border-b border-rose-100">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="font-[family-name:var(--font-poppins)] text-xl font-bold text-rose-700"
          >
            Celovia
          </Link>
          <div className="flex items-center gap-1">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i <= step ? "bg-rose-500" : "bg-rose-200"
                  }`}
                />
                {i < STEPS.length - 1 && (
                  <div
                    className={`w-6 h-0.5 transition-colors ${
                      i < step ? "bg-rose-500" : "bg-rose-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 0 && (
                <TemplateSelect
                  selected={templateId}
                  onSelect={handleTemplateSelect}
                />
              )}
              {step === 1 && (
                <PersonalDetails
                  senderName={senderName}
                  recipientName={recipientName}
                  memories={memories}
                  hints={hints}
                  onSenderNameChange={setSenderName}
                  onRecipientNameChange={setRecipientName}
                  onMemoryChange={handleMemoryChange}
                  onHintsChange={setHints}
                  errors={errors}
                />
              )}
              {step === 2 && (
                <StyleCustomization
                  templateId={templateId}
                  styleConfig={styleConfig}
                  onStyleChange={setStyleConfig}
                />
              )}
              {step === 3 && (
                <PreviewGenerate
                  templateId={templateId}
                  styleConfig={styleConfig}
                  senderName={senderName}
                  recipientName={recipientName}
                  generatedMessage={generatedMessage}
                  generatedImageUrl={generatedImageUrl}
                  isGenerating={isGenerating}
                  onGenerate={handleGenerate}
                  onRegenerateMessage={handleRegenerateMessage}
                  onRegenerateImage={handleRegenerateImage}
                />
              )}
              {step === 4 && (
                <ShareStep
                  shareUrl={shareUrl}
                  isSaving={isSaving}
                  onSave={handleSave}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Error display */}
          {(errors.generate || errors.save) && (
            <p className="text-red-500 text-sm text-center mt-4">
              {errors.generate || errors.save}
            </p>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {step > 0 ? (
              <button
                onClick={prevStep}
                className="text-rose-600 font-medium hover:text-rose-700 transition-colors cursor-pointer"
              >
                Back
              </button>
            ) : (
              <div />
            )}
            {step < 3 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={nextStep}
                className="bg-rose-500 hover:bg-rose-600 text-white font-medium px-6 py-2.5 rounded-full transition-colors cursor-pointer"
              >
                Next
              </motion.button>
            )}
            {step === 3 && generatedMessage && !isGenerating && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={nextStep}
                className="bg-rose-500 hover:bg-rose-600 text-white font-medium px-6 py-2.5 rounded-full transition-colors cursor-pointer"
              >
                Continue to Share
              </motion.button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
