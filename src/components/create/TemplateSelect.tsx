"use client";

import { motion } from "framer-motion";
import { templates } from "@/lib/templates";
import type { TemplateId } from "@/types";

interface TemplateSelectProps {
  selected: TemplateId;
  onSelect: (id: TemplateId) => void;
}

export default function TemplateSelect({
  selected,
  onSelect,
}: TemplateSelectProps) {
  return (
    <div>
      <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-rose-900 mb-2">
        Choose Your Style
      </h2>
      <p className="text-rose-700/60 mb-6">
        Pick a template that matches your vibe.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {templates.map((template) => (
          <motion.button
            key={template.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(template.id)}
            className={`p-6 rounded-2xl text-left transition-all cursor-pointer border-2 ${
              selected === template.id
                ? "border-rose-500 shadow-lg shadow-rose-500/20"
                : "border-transparent shadow-sm hover:shadow-md"
            }`}
            style={{
              background: template.colors.background,
              color: template.colors.text,
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ background: template.colors.primary }}
              />
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: template.colors.secondary }}
              />
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: template.colors.accent }}
              />
            </div>
            <h3 className="text-lg font-semibold mb-1">{template.name}</h3>
            <p className="text-sm opacity-70">{template.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
