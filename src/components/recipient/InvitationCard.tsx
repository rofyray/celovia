"use client";

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
  const template = getTemplate(invitation.template_id);
  const font =
    (invitation.style_config as { font?: string })?.font ||
    template.fonts[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-lg mx-auto px-6 py-8"
    >
      {/* Card */}
      <div
        className="rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: template.colors.background }}
      >
        {/* Image */}
        {invitation.generated_image_url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={invitation.generated_image_url}
              alt="Invitation artwork"
              className="w-full h-56 object-cover"
            />
          </motion.div>
        )}

        {/* Content */}
        <div
          className="p-8"
          style={{ color: template.colors.text, fontFamily: font }}
        >
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs uppercase tracking-[0.2em] mb-6"
            style={{ color: template.colors.primary }}
          >
            Be My Valentine
          </motion.p>

          {/* To */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xl font-bold mb-4"
          >
            Dear {invitation.recipient_name},
          </motion.p>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="text-base leading-relaxed whitespace-pre-line mb-8 opacity-85"
          >
            {invitation.generated_message}
          </motion.div>

          {/* From */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="border-t pt-4 mb-8"
            style={{ borderColor: `${template.colors.text}15` }}
          >
            <p className="text-sm font-semibold">
              With all my love,
            </p>
            <p className="text-lg font-bold" style={{ color: template.colors.primary }}>
              {invitation.sender_name}
            </p>
          </motion.div>

          {/* RSVP */}
          {invitation.rsvp_status === "pending" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="text-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRsvp}
                className="inline-flex items-center gap-2 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-colors cursor-pointer"
                style={{
                  background: template.colors.primary,
                  boxShadow: `0 10px 30px ${template.colors.primary}40`,
                }}
              >
                <span className="text-xl">💝</span>
                Yes, I&apos;ll be your Valentine!
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
