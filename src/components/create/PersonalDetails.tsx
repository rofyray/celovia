"use client";

import type { Memory } from "@/types";

interface PersonalDetailsProps {
  senderName: string;
  recipientName: string;
  memories: Memory[];
  hints: string;
  onSenderNameChange: (name: string) => void;
  onRecipientNameChange: (name: string) => void;
  onMemoryChange: (index: number, field: keyof Memory, value: string) => void;
  onHintsChange: (hints: string) => void;
  errors: Record<string, string>;
}

export default function PersonalDetails({
  senderName,
  recipientName,
  memories,
  hints,
  onSenderNameChange,
  onRecipientNameChange,
  onMemoryChange,
  onHintsChange,
  errors,
}: PersonalDetailsProps) {
  return (
    <div>
      <h2 className="font-[family-name:var(--font-poppins)] text-2xl font-bold text-rose-900 mb-2">
        Personal Details
      </h2>
      <p className="text-rose-700/60 mb-6">
        Tell us about you and your special someone.
      </p>

      <div className="space-y-6">
        {/* Names */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-rose-800 mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => onSenderNameChange(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-xl border border-rose-200 bg-white/80 text-rose-900 placeholder:text-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
            />
            {errors.senderName && (
              <p className="text-red-500 text-xs mt-1">{errors.senderName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-rose-800 mb-1">
              Their Name
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => onRecipientNameChange(e.target.value)}
              placeholder="Their name"
              className="w-full px-4 py-3 rounded-xl border border-rose-200 bg-white/80 text-rose-900 placeholder:text-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
            />
            {errors.recipientName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.recipientName}
              </p>
            )}
          </div>
        </div>

        {/* Memories */}
        <div>
          <label className="block text-sm font-medium text-rose-800 mb-3">
            Shared Memories (up to 3)
          </label>
          <div className="space-y-4">
            {memories.map((memory, i) => (
              <div
                key={i}
                className="bg-white/60 rounded-xl p-4 border border-rose-100 space-y-2"
              >
                <input
                  type="text"
                  value={memory.title}
                  onChange={(e) => onMemoryChange(i, "title", e.target.value)}
                  placeholder={`Memory ${i + 1} title (e.g. "Our first date")`}
                  className="w-full px-3 py-2 rounded-lg border border-rose-200 bg-white/80 text-rose-900 text-sm placeholder:text-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
                />
                <textarea
                  value={memory.description}
                  onChange={(e) =>
                    onMemoryChange(i, "description", e.target.value)
                  }
                  placeholder="Describe this memory..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-rose-200 bg-white/80 text-rose-900 text-sm placeholder:text-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent resize-none"
                />
                {errors[`memory_${i}`] && (
                  <p className="text-red-500 text-xs">{errors[`memory_${i}`]}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Hints */}
        <div>
          <label className="block text-sm font-medium text-rose-800 mb-1">
            Personal Hints{" "}
            <span className="text-rose-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={hints}
            onChange={(e) => onHintsChange(e.target.value)}
            placeholder="Inside jokes, how you met, favorite songs, anything special..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-rose-200 bg-white/80 text-rose-900 placeholder:text-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent resize-none"
          />
        </div>
      </div>
    </div>
  );
}
