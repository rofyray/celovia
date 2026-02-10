"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { getTemplate } from "@/lib/templates";
import type { Invitation } from "@/types";

type Phase = "front" | "flipping" | "opening" | "emerging" | "done";

interface EnvelopeAnimationProps {
  invitation: Invitation;
  onComplete: () => void;
}

export default function EnvelopeAnimation({
  invitation,
  onComplete,
}: EnvelopeAnimationProps) {
  const [phase, setPhase] = useState<Phase>("front");
  const template = getTemplate(invitation.template_id);

  const handleTap = useCallback(() => {
    if (phase === "front") {
      setPhase("flipping");
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "flipping") {
      const t = setTimeout(() => setPhase("opening"), 1100);
      return () => clearTimeout(t);
    }
    if (phase === "opening") {
      const t = setTimeout(() => setPhase("emerging"), 800);
      return () => clearTimeout(t);
    }
    if (phase === "emerging") {
      const t = setTimeout(() => {
        setPhase("done");
        onComplete();
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  const isFlipped = phase !== "front";
  const isFlapOpen = phase === "opening" || phase === "emerging" || phase === "done";
  const isCardEmerging = phase === "emerging" || phase === "done";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      {/* 3D scene */}
      <div style={{ perspective: "1200px" }}>
        <motion.div
          className="relative w-72 sm:w-80 h-48 sm:h-56 cursor-pointer"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          onClick={handleTap}
        >
          {/* ===== FRONT FACE ===== */}
          <div
            className="absolute inset-0 rounded-2xl shadow-2xl overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              background: "#ffffff",
            }}
          >
            {/* Subtle paper texture lines */}
            <div className="absolute inset-0 opacity-[0.04]">
              <div className="absolute inset-x-0 top-1/3 h-px bg-gray-400" />
              <div className="absolute inset-x-0 top-1/2 h-px bg-gray-400" />
              <div className="absolute inset-x-0 top-2/3 h-px bg-gray-400" />
            </div>

            {/* Recipient name - centered */}
            <div className="absolute inset-0 flex items-center justify-center">
              <p
                className="text-2xl sm:text-3xl"
                style={{ fontFamily: "Dancing Script, cursive" }}
              >
                {invitation.recipient_name}
              </p>
            </div>

            {/* Heart stamp - upper right */}
            <div
              className="absolute top-3 right-3 w-12 h-12 rounded-lg border-2 flex items-center justify-center"
              style={{ borderColor: template.colors.primary }}
            >
              <span className="text-2xl">💌</span>
            </div>

            {/* Decorative bottom edge */}
            <div
              className="absolute bottom-0 inset-x-0 h-1"
              style={{ background: template.colors.secondary }}
            />
          </div>

          {/* ===== BACK FACE ===== */}
          <div
            className="absolute inset-0 rounded-2xl shadow-2xl overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: "#ffffff",
            }}
          >
            {/* Diamond fold pattern */}
            <div className="absolute inset-0" style={{ zIndex: 10 }}>
              {/* Left triangle */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  clipPath: "polygon(0 0, 50% 50%, 0 100%)",
                  background: template.colors.primary,
                }}
              />
              {/* Right triangle */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  clipPath: "polygon(100% 0, 50% 50%, 100% 100%)",
                  background: template.colors.primary,
                }}
              />
              {/* Bottom triangle */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  clipPath: "polygon(0 100%, 50% 50%, 100% 100%)",
                  background: template.colors.primary,
                }}
              />
            </div>

            {/* Sender name - centered */}
            <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 15 }}>
              <p
                className="text-lg sm:text-xl text-gray-600"
                style={{ fontFamily: "Dancing Script, cursive" }}
              >
                From {invitation.sender_name}
              </p>
            </div>

            {/* ===== TOP FLAP ===== */}
            <motion.div
              className="absolute inset-x-0 top-0 origin-top"
              style={{
                zIndex: 30,
                transformStyle: "preserve-3d",
                height: "55%",
              }}
              animate={{ rotateX: isFlapOpen ? -160 : 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              {/* Flap outer (paper-colored) */}
              <div
                className="absolute inset-0"
                style={{
                  backfaceVisibility: "hidden",
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  background: "#f5f5f4",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              />
              {/* Flap inner (colored liner) */}
              <div
                className="absolute inset-0"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateX(180deg)",
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  background: template.colors.secondary,
                }}
              />
            </motion.div>

            {/* ===== CARD SLOT ===== */}
            <motion.div
              className="absolute left-3 right-3 bottom-3 rounded-lg overflow-hidden bg-white shadow-md"
              style={{
                zIndex: 20,
                top: "30%",
              }}
              animate={{
                y: isCardEmerging ? "-120%" : "0%",
                opacity: isCardEmerging ? 0.8 : 1,
              }}
              transition={{ duration: 1.0, ease: "easeOut" }}
            >
              {invitation.generated_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={invitation.generated_image_url}
                  alt="Card preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: template.colors.background }}
                >
                  <span className="text-3xl">💝</span>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Tap instruction - only shown on front phase */}
      {phase === "front" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-rose-400 text-sm mt-8 animate-pulse-soft"
        >
          Tap to open your invitation
        </motion.p>
      )}
    </div>
  );
}
