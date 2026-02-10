"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { getTemplate } from "@/lib/templates";
import type { Invitation } from "@/types";

interface InvitationCardProps {
  invitation: Invitation;
  onRsvp: () => void;
}

export default function InvitationCard({
  invitation,
  onRsvp,
}: InvitationCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const template = getTemplate(invitation.template_id);
  const font =
    (invitation.style_config as { font?: string })?.font ||
    template.fonts[0];

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
            {invitation.generated_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={invitation.generated_image_url}
                alt="Invitation artwork"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ background: template.colors.background }}
              >
                <span className="text-6xl">💝</span>
              </div>
            )}

            {/* Name overlay at bottom */}
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
              color: template.colors.text,
              fontFamily: font,
            }}
          >
            <div className="absolute inset-0 flex flex-col p-5 sm:p-6 overflow-y-auto">
              {/* Tagline */}
              <p
                className="text-xs uppercase tracking-[0.2em] mb-4"
                style={{ color: template.colors.primary }}
              >
                Be My Valentine
              </p>

              {/* Greeting */}
              <p className="text-lg font-bold mb-2">
                Dear {invitation.recipient_name},
              </p>

              {/* Message body */}
              <div className="text-sm leading-relaxed whitespace-pre-line opacity-85 flex-1 mb-4">
                {invitation.generated_message}
              </div>

              {/* Signature */}
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

              {/* RSVP */}
              {invitation.rsvp_status === "pending" && (
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
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
