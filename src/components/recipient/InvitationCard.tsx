"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { getTemplate } from "@/lib/templates";
import type { Invitation, StyleConfig, Template } from "@/types";

interface InvitationCardProps {
  invitation: Invitation;
  onRsvp: () => void;
}

interface LayoutProps {
  invitation: Invitation;
  template: Template;
  font: string;
  onRsvp: () => void;
}

function RsvpButton({
  invitation,
  template,
  onRsvp,
}: {
  invitation: Invitation;
  template: Template;
  onRsvp: () => void;
}) {
  if (invitation.rsvp_status !== "pending") return null;
  return (
    <div className="text-center pb-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRsvp}
        className="inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-full shadow-lg cursor-pointer"
        style={{
          background: template.colors.primary,
          boxShadow: `0 10px 30px ${template.colors.primary}40`,
        }}
      >
        <span className="text-xl">💝</span>
        Yes, I&apos;ll be your Valentine!
      </motion.button>
    </div>
  );
}

function MessageContent({
  invitation,
  template,
  font,
  onRsvp,
}: LayoutProps) {
  return (
    <div
      className="flex flex-col h-full"
      style={{ color: template.colors.text, fontFamily: font }}
    >
      <p
        className="text-xs uppercase tracking-[0.2em] mb-4"
        style={{ color: template.colors.primary }}
      >
        Be My Valentine
      </p>
      <p className="text-lg font-bold mb-2">
        Dear {invitation.recipient_name},
      </p>
      <div className="text-sm leading-relaxed whitespace-pre-line opacity-85 flex-1 mb-4">
        {invitation.generated_message}
      </div>
      <div
        className="border-t pt-3 mb-4"
        style={{ borderColor: `${template.colors.text}15` }}
      >
        <p className="text-sm font-semibold">With all my love,</p>
        <p
          className="text-lg font-bold"
          style={{ color: template.colors.primary }}
        >
          {invitation.sender_name}
        </p>
      </div>
      <RsvpButton invitation={invitation} template={template} onRsvp={onRsvp} />
    </div>
  );
}

function ImagePanel({
  invitation,
  template,
  className,
}: {
  invitation: Invitation;
  template: Template;
  className?: string;
}) {
  return invitation.generated_image_url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={invitation.generated_image_url}
      alt="Invitation artwork"
      className={className || "w-full h-full object-cover"}
    />
  ) : (
    <div
      className={`flex items-center justify-center ${className || "w-full h-full"}`}
      style={{ background: template.colors.background }}
    >
      <span className="text-6xl">💝</span>
    </div>
  );
}

/* ===== Centered Layout ===== */
function CenteredLayout({ invitation, template, font, onRsvp }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: template.colors.background }}
      >
        {/* Image on top */}
        <div className="w-full h-64 sm:h-80 relative">
          <ImagePanel
            invitation={invitation}
            template={template}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent pt-10 pb-4 px-5">
            <p
              className="text-white text-xl"
              style={{ fontFamily: "Dancing Script, cursive" }}
            >
              For {invitation.recipient_name}
            </p>
          </div>
        </div>

        {/* Message below */}
        <div className="p-5 sm:p-8">
          <MessageContent
            invitation={invitation}
            template={template}
            font={font}
            onRsvp={onRsvp}
          />
        </div>
      </motion.div>
    </div>
  );
}

/* ===== Split Layout ===== */
function SplitLayout({ invitation, template, font, onRsvp }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
        style={{ background: template.colors.background }}
      >
        {/* Image left panel */}
        <div className="md:w-[40%] w-full h-64 md:h-auto relative flex-shrink-0">
          <ImagePanel
            invitation={invitation}
            template={template}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent pt-10 pb-4 px-5 md:hidden">
            <p
              className="text-white text-xl"
              style={{ fontFamily: "Dancing Script, cursive" }}
            >
              For {invitation.recipient_name}
            </p>
          </div>
        </div>

        {/* Message right panel */}
        <div className="md:w-[60%] w-full p-5 sm:p-8 md:overflow-y-auto md:max-h-[80vh]">
          <MessageContent
            invitation={invitation}
            template={template}
            font={font}
            onRsvp={onRsvp}
          />
        </div>
      </motion.div>
    </div>
  );
}

/* ===== Fullscreen Layout (existing 3D flip card) ===== */
function FullscreenLayout({ invitation, template, font, onRsvp }: LayoutProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-8">
      {/* Flip Card button */}
      <motion.button
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={() => setIsFlipped((f) => !f)}
        className="mb-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white shadow-lg transition-colors cursor-pointer"
        style={{
          background: template.colors.primary,
          boxShadow: `0 4px 20px ${template.colors.primary}30`,
        }}
      >
        {/* Rotate icon */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 2v6h-6" />
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
          <path d="M3 22v-6h6" />
          <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
        </svg>
        {isFlipped ? "View Image" : "Read Message"}
      </motion.button>

      {/* 3D card scene */}
      <div style={{ perspective: "1200px" }} className="w-full max-w-2xl">
        <motion.div
          className="relative w-full"
          style={{
            transformStyle: "preserve-3d",
            aspectRatio: "4/3",
          }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* ===== FRONT FACE — Image ===== */}
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl"
            style={{ backfaceVisibility: "hidden" }}
          >
            <ImagePanel
              invitation={invitation}
              template={template}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent pt-12 pb-5 px-5">
              <p
                className="text-white text-xl"
                style={{ fontFamily: "Dancing Script, cursive" }}
              >
                For {invitation.recipient_name}
              </p>
            </div>
          </div>

          {/* ===== BACK FACE — Message ===== */}
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: template.colors.background,
            }}
          >
            <div className="absolute inset-0 p-5 sm:p-6 overflow-y-auto">
              <MessageContent
                invitation={invitation}
                template={template}
                font={font}
                onRsvp={onRsvp}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function InvitationCard({
  invitation,
  onRsvp,
}: InvitationCardProps) {
  const template = getTemplate(invitation.template_id);
  const styleConfig = invitation.style_config as StyleConfig;
  const font = styleConfig?.font || template.fonts[0];
  const layout = styleConfig?.layout || "fullscreen";

  const layoutProps: LayoutProps = { invitation, template, font, onRsvp };

  switch (layout) {
    case "centered":
      return <CenteredLayout {...layoutProps} />;
    case "split":
      return <SplitLayout {...layoutProps} />;
    case "fullscreen":
    default:
      return <FullscreenLayout {...layoutProps} />;
  }
}
