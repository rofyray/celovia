"use client";

import { getTemplate } from "@/lib/templates";
import type { StyleConfig, TemplateId } from "@/types";

interface StyleCustomizationProps {
  templateId: TemplateId;
  styleConfig: StyleConfig;
  onStyleChange: (config: StyleConfig) => void;
}

const layoutOptions = [
  { value: "centered" as const, label: "Centered", icon: "◻️" },
  { value: "split" as const, label: "Split", icon: "◧" },
  { value: "fullscreen" as const, label: "Fullscreen", icon: "⬛" },
];

export default function StyleCustomization({
  templateId,
  styleConfig,
  onStyleChange,
}: StyleCustomizationProps) {
  const template = getTemplate(templateId);

  return (
    <div>
      <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-rose-900 mb-2">
        Customize Your Style
      </h2>
      <p className="text-rose-700/60 mb-6">Fine-tune the look and feel.</p>

      <div className="space-y-8">
        {/* Font Selector */}
        <div>
          <label className="block text-sm font-medium text-rose-800 mb-3">
            Font
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {template.fonts.map((font) => (
              <button
                key={font}
                onClick={() => onStyleChange({ ...styleConfig, font })}
                className={`px-4 py-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                  styleConfig.font === font
                    ? "border-rose-500 bg-rose-50 shadow-sm"
                    : "border-rose-200 bg-white/60 hover:border-rose-300"
                }`}
              >
                <span className="text-rose-900 text-sm font-medium">
                  {font}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Layout Toggle */}
        <div>
          <label className="block text-sm font-medium text-rose-800 mb-3">
            Layout
          </label>
          <div className="grid grid-cols-3 gap-3">
            {layoutOptions.map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  onStyleChange({ ...styleConfig, layout: option.value })
                }
                className={`px-4 py-4 rounded-xl border-2 text-center transition-all cursor-pointer ${
                  styleConfig.layout === option.value
                    ? "border-rose-500 bg-rose-50 shadow-sm"
                    : "border-rose-200 bg-white/60 hover:border-rose-300"
                }`}
              >
                <div className="text-2xl mb-1">{option.icon}</div>
                <span className="text-rose-900 text-xs font-medium">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white/60 rounded-2xl p-6 border border-rose-100">
          <p className="text-xs text-rose-400 uppercase tracking-wider mb-3">
            Preview
          </p>
          <div
            className="rounded-xl p-6"
            style={{
              background: template.colors.background,
              color: template.colors.text,
            }}
          >
            <p className="text-lg font-semibold" style={{ fontFamily: styleConfig.font }}>
              {template.name} style
            </p>
            <p className="text-sm opacity-70 mt-1" style={{ fontFamily: styleConfig.font }}>
              Your invitation will look like this.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
