"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface ShareStepProps {
  shareUrl: string;
  isSaving: boolean;
  onSave: () => void;
}

export default function ShareStep({
  shareUrl,
  isSaving,
  onSave,
}: ShareStepProps) {
  const [copied, setCopied] = useState(false);

  if (!shareUrl && !isSaving) {
    return (
      <div className="text-center py-12">
        <h2 className="font-[family-name:var(--font-poppins)] text-2xl font-bold text-rose-900 mb-2">
          Ready to Share?
        </h2>
        <p className="text-rose-700/60 mb-8">
          Save your invitation and get a shareable link.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSave}
          className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg shadow-rose-500/30 transition-colors cursor-pointer"
        >
          Save & Get Link
        </motion.button>
      </div>
    );
  }

  if (isSaving) {
    return (
      <div className="text-center py-16">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="inline-block text-4xl mb-4"
        >
          💌
        </motion.div>
        <p className="text-rose-700 font-medium">Saving your invitation...</p>
      </div>
    );
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "You've received a Valentine's invitation!",
          url: shareUrl,
        });
      } catch {
        // User cancelled share
      }
    }
  };

  return (
    <div className="text-center py-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="text-5xl mb-4"
      >
        🎉
      </motion.div>
      <h2 className="font-[family-name:var(--font-poppins)] text-2xl font-bold text-rose-900 mb-2">
        Your Invitation is Ready!
      </h2>
      <p className="text-rose-700/60 mb-8">
        Share this link with your special someone.
      </p>

      {/* Link Display */}
      <div className="bg-white/80 border border-rose-200 rounded-xl p-4 mb-4 flex items-center gap-3">
        <input
          type="text"
          readOnly
          value={shareUrl}
          className="flex-1 bg-transparent text-rose-900 text-sm focus:outline-none truncate"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="px-4 py-2 bg-rose-500 text-white text-sm font-medium rounded-lg hover:bg-rose-600 transition-colors shrink-0 cursor-pointer"
        >
          {copied ? "Copied!" : "Copy"}
        </motion.button>
      </div>

      {/* Share Button (if Web Share API available) */}
      {typeof navigator !== "undefined" && "share" in navigator && (
        <button
          onClick={handleShare}
          className="text-sm text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
        >
          Share via...
        </button>
      )}
    </div>
  );
}
