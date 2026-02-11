"use client";

import { useState } from "react";
import type { Memory } from "@/types";

interface PersonalDetailsProps {
  senderName: string;
  recipientName: string;
  memories: Memory[];
  imageDescription: string;
  hints: string;
  onSenderNameChange: (name: string) => void;
  onRecipientNameChange: (name: string) => void;
  onMemoryChange: (index: number, field: keyof Memory, value: string) => void;
  onAddMemory: () => void;
  onImageDescriptionChange: (desc: string) => void;
  onHintsChange: (hints: string) => void;
  errors: Record<string, string>;
}

export default function PersonalDetails({
  senderName,
  recipientName,
  memories,
  imageDescription,
  hints,
  onSenderNameChange,
  onRecipientNameChange,
  onMemoryChange,
  onAddMemory,
  onImageDescriptionChange,
  onHintsChange,
  errors,
}: PersonalDetailsProps) {
  const [showHints, setShowHints] = useState(hints.length > 0);

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
            Shared Memories
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
                  placeholder='Memory title (e.g. "Our first date")'
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
          {memories.length < 3 && (
            <div className="flex justify-end mt-3">
              <button
                type="button"
                onClick={onAddMemory}
                className="text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                + Add Memory
              </button>
            </div>
          )}
        </div>

        {/* Card Image Description */}
        <div>
          <label className="block text-sm font-medium text-rose-800 mb-1">
            Card Image Description
          </label>
          <textarea
            value={imageDescription}
            onChange={(e) => onImageDescriptionChange(e.target.value)}
            placeholder="Describe what you'd like the card image to look like — the scene, setting, characters (e.g. detailed appearance, skin tone, hair, clothing), mood, and any specific elements you'd like included..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-rose-200 bg-white/80 text-rose-900 placeholder:text-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent resize-none"
          />
          {errors.imageDescription && (
            <p className="text-red-500 text-xs mt-1">
              {errors.imageDescription}
            </p>
          )}
        </div>

        {/* Hints */}
        <div>
          {showHints ? (
            <>
              <label className="block text-sm font-medium text-rose-800 mb-1">
                Personal Hints
              </label>
              <textarea
                value={hints}
                onChange={(e) => onHintsChange(e.target.value)}
                placeholder="Inside jokes, how you met, favorite songs, anything special..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-rose-200 bg-white/80 text-rose-900 placeholder:text-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent resize-none"
              />
            </>
          ) : (
            <button
              type="button"
              onClick={() => setShowHints(true)}
              className="text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              + Add Personal Hints
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
