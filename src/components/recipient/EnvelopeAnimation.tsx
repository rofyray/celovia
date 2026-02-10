"use client";

import { motion } from "framer-motion";

interface EnvelopeAnimationProps {
  onComplete: () => void;
}

export default function EnvelopeAnimation({
  onComplete,
}: EnvelopeAnimationProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        className="relative cursor-pointer"
        onClick={onComplete}
        whileHover={{ scale: 1.05 }}
      >
        {/* Envelope body */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative w-80 h-52 bg-gradient-to-b from-rose-100 to-rose-200 rounded-2xl shadow-2xl shadow-rose-500/20 overflow-hidden"
        >
          {/* Envelope flap */}
          <motion.div
            initial={{ rotateX: 0 }}
            animate={{ rotateX: 180 }}
            transition={{ duration: 0.8, delay: 1.2, ease: "easeInOut" }}
            style={{ transformOrigin: "top center" }}
            className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-rose-300 to-rose-200"
            // Triangle shape via clip-path
            // Clip path creates the envelope flap triangle
          >
            <div
              className="w-full h-full bg-gradient-to-b from-rose-300 to-rose-200"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              }}
            />
          </motion.div>

          {/* Heart seal */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-5xl block"
            >
              💌
            </motion.span>
          </motion.div>

          {/* Decorative lines */}
          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <div className="h-1 bg-rose-300/30 rounded-full" />
            <div className="h-1 bg-rose-300/20 rounded-full w-3/4" />
          </div>
        </motion.div>

        {/* Tap instruction */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-center text-rose-400 text-sm mt-6 animate-pulse-soft"
        >
          Tap to open your invitation
        </motion.p>
      </motion.div>
    </div>
  );
}
