"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const messages = [
  "You and {name} are going to have the most amazing Valentine's Day together.",
  "Get ready for an unforgettable Valentine's Day with {name}!",
  "You and {name} just made this Valentine's Day truly special.",
  "Love is in the air! You and {name} are in for a magical day.",
  "This Valentine's Day just got a whole lot sweeter with you and {name}.",
  "Adventure awaits! You and {name} are about to make wonderful memories.",
];

const pulsatingEmojis = ["💕", "💞", "💖", "💗", "💓", "💝"];

const particleEmojis = [
  "💖", "❤️", "💗", "💝", "💘", "🎈", "🎈", "✨", "💕", "💞", "🍫",
];

const headings = [
  "It's a Yes!",
  "It's a Date!",
  "Love Wins!",
  "You Said Yes!",
  "It's Official!",
  "Best. Answer. Ever!",
];

interface Particle {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
}

function generateParticles(): Particle[] {
  return Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 4,
    size: 16 + Math.random() * 24,
  }));
}

function pickParticleEmoji(): string {
  return particleEmojis[Math.floor(Math.random() * particleEmojis.length)];
}

function pickHeading(): string {
  return headings[Math.floor(Math.random() * headings.length)];
}

function pickMessage(): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

function pickPulsatingEmoji(): string {
  return pulsatingEmojis[Math.floor(Math.random() * pulsatingEmojis.length)];
}

export default function Celebration({ senderName }: { senderName: string }) {
  const particles = useMemo(() => generateParticles(), []);
  const particleEmoji = useMemo(() => pickParticleEmoji(), []);
  const message = useMemo(() => pickMessage(), []);
  const pulsatingEmoji = useMemo(() => pickPulsatingEmoji(), []);
  const heading = useMemo(() => pickHeading(), []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: "100vh", x: `${p.x}vw`, opacity: 0 }}
          animate={{ y: "-20vh", opacity: [0, 1, 1, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className="absolute pointer-events-none"
          style={{ fontSize: p.size }}
        >
          {particleEmoji}
        </motion.div>
      ))}

      {/* Content */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="text-center z-10"
      >
        {/* Bear + Chocolate */}
        <motion.span
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.8, delay: 0.1 }}
          className="text-9xl md:text-[10rem] animate-float block mb-6"
        >
          🧸
        </motion.span>

        {/* Pulsating emoji */}
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-7xl mb-6"
        >
          {pulsatingEmoji}
        </motion.div>

        <h1 className="font-[family-name:var(--font-poppins)] text-3xl md:text-5xl font-bold text-rose-900 mb-4">
          {heading}
        </h1>
        <p className="text-lg text-rose-700/70 max-w-md mx-auto">
          {message.replace("{name}", senderName)}
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-10"
        >
          <Link
            href="/create"
            className="inline-block px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-full shadow-lg transition-colors text-lg"
          >
            Send Love to Someone Special
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
