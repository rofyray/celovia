"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

interface Heart {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
}

function generateHearts(): Heart[] {
  return Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 4,
    size: 16 + Math.random() * 24,
  }));
}

export default function Celebration({ senderName }: { senderName: string }) {
  const hearts = useMemo(() => generateHearts(), []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Floating hearts */}
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ y: "100vh", x: `${heart.x}vw`, opacity: 0 }}
          animate={{ y: "-20vh", opacity: [0, 1, 1, 0] }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className="absolute pointer-events-none"
          style={{ fontSize: heart.size }}
        >
          💖
        </motion.div>
      ))}

      {/* Content */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="text-center z-10"
      >
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-7xl mb-6"
        >
          💕
        </motion.div>
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-bold text-rose-900 mb-4">
          It&apos;s a Yes!
        </h1>
        <p className="text-lg text-rose-700/70 max-w-md mx-auto">
          You and {senderName} are going to have the most amazing Valentine&apos;s Day
          together.
        </p>
      </motion.div>
    </div>
  );
}
