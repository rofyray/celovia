"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const features = [
  {
    icon: "💌",
    title: "Choose a Template",
    description:
      "Pick from elegant, bold, playful, or minimal styles to match your vibe.",
  },
  {
    icon: "✨",
    title: "Add Your Memories",
    description:
      "Share your favorite moments together. Bemy turns them into a heartfelt message.",
  },
  {
    icon: "🎨",
    title: "Art by Bemy",
    description:
      "A unique, beautiful image created just for your Valentine.",
  },
  {
    icon: "💝",
    title: "Share & Surprise",
    description:
      "Send a magical link. They open an animated envelope and say yes!",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-[family-name:var(--font-poppins)] text-2xl font-bold text-rose-700">
            Celovia
          </span>
          <Link
            href="/create"
            className="text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mt-12 md:mt-20"
        >
          <motion.div
            className="text-6xl mb-6"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            💌
          </motion.div>
          <h1 className="font-[family-name:var(--font-poppins)] text-4xl md:text-6xl font-bold text-rose-900 mb-4 leading-tight">
            Ask them to be
            <br />
            <span className="text-rose-500">your Valentine</span>
          </h1>
          <p className="text-lg md:text-xl text-rose-700/70 mb-10 max-w-xl mx-auto">
            Create a beautiful, Bemy-crafted Valentine filled with your
            shared memories. Send it as a magical animated link.
          </p>
          <Link href="/create">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-rose-500 hover:bg-rose-600 text-white text-lg font-semibold px-10 py-4 rounded-full shadow-lg shadow-rose-500/30 transition-colors cursor-pointer"
            >
              Create Your Valentine
            </motion.button>
          </Link>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-5xl mx-auto mt-24 mb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center shadow-sm border border-rose-100"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-rose-900 mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-rose-700/60">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-rose-400">
        Made with ♥️ — Celovia
      </footer>
    </div>
  );
}
