"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTemplate } from "@/lib/templates";
import type { TemplateId, StyleConfig, GeneratedMessage } from "@/types";

const bemyMessages = [
  "Bemy is writing your love letter...",
  "Bemy is painting something beautiful...",
  "Adding a sprinkle of magic...",
  "Weaving your memories into poetry...",
  "Almost ready to steal their heart...",
];

function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % bemyMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center py-16">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="inline-block text-4xl mb-4"
      >
        ✨
      </motion.div>
      <p className="text-rose-700 font-medium">Creating your Valentine...</p>
      <div className="h-6 mt-1">
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-rose-400 text-sm"
          >
            {bemyMessages[messageIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

interface PreviewGenerateProps {
  templateId: TemplateId;
  styleConfig: StyleConfig;
  senderName: string;
  recipientName: string;
  generatedMessage: GeneratedMessage | null;
  generatedImageUrl: string | null;
  isGenerating: boolean;
  onGenerate: () => void;
  onRegenerateMessage: () => void;
  onRegenerateImage: () => void;
}

export default function PreviewGenerate({
  templateId,
  styleConfig,
  senderName,
  recipientName,
  generatedMessage,
  generatedImageUrl,
  isGenerating,
  onGenerate,
  onRegenerateMessage,
  onRegenerateImage,
}: PreviewGenerateProps) {
  const template = getTemplate(templateId);

  if (!generatedMessage && !isGenerating) {
    return (
      <div className="text-center py-12">
        <h2 className="font-[family-name:var(--font-poppins)] text-2xl font-bold text-rose-900 mb-2">
          Preview Your Valentine
        </h2>
        <p className="text-rose-700/60 mb-8">
          Bemy will craft a personalized message and generate a beautiful image.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={onGenerate}
          className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg shadow-rose-500/30 transition-colors cursor-pointer"
        >
          Generate Valentine
        </motion.button>
      </div>
    );
  }

  if (isGenerating) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <h2 className="font-[family-name:var(--font-poppins)] text-2xl font-bold text-rose-900 mb-6">
        Your Valentine
      </h2>

      {/* Preview Card */}
      <div
        className="rounded-2xl overflow-hidden shadow-xl"
        style={{ background: template.colors.background }}
      >
        {/* Generated Image */}
        {generatedImageUrl && (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={generatedImageUrl}
              alt="Generated Valentine art"
              className="w-full h-64 object-cover"
            />
            <button
              onClick={onRegenerateImage}
              className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm text-rose-700 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-white transition-colors cursor-pointer"
            >
              Regenerate Image
            </button>
          </div>
        )}

        {/* Content */}
        <div
          className="p-8"
          style={{ color: template.colors.text, fontFamily: styleConfig.font }}
        >
          {generatedMessage && (
            <>
              <p className="text-xs uppercase tracking-widest opacity-50 mb-4">
                {generatedMessage.tagline}
              </p>
              <div className="text-base leading-relaxed whitespace-pre-line mb-6">
                {generatedMessage.message}
              </div>
              <p className="text-sm opacity-60 italic">
                {generatedMessage.storyArc}
              </p>
              <div className="mt-6 pt-4 border-t border-current/10">
                <p className="text-sm font-semibold">
                  With love, {senderName}
                </p>
                <p className="text-sm opacity-60">To {recipientName}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Regenerate */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={onRegenerateMessage}
          className="flex-1 text-sm text-rose-600 border border-rose-200 rounded-xl py-2 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          Regenerate Message
        </button>
        <button
          onClick={onRegenerateImage}
          className="flex-1 text-sm text-rose-600 border border-rose-200 rounded-xl py-2 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          Regenerate Image
        </button>
      </div>
    </div>
  );
}
