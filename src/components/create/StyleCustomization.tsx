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
      <h2 className="font-[family-name:var(--font-poppins)] text-2xl font-bold text-rose-900 mb-2">
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
                <span className="text-rose-900 text-sm font-medium" style={{ fontFamily: font }}>
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

          {styleConfig.layout === "centered" && (
            <div className="min-h-[140px] flex items-center justify-center py-2">
              <div className="w-[180px] rounded-xl overflow-hidden shadow-md border border-black/10">
                {/* Image area */}
                <div
                  className="h-[56px] flex items-center justify-center text-xl"
                  style={{
                    background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.accent})`,
                  }}
                >
                  💌
                </div>
                {/* Text area */}
                <div
                  className="px-3 py-3 flex flex-col items-center text-center"
                  style={{
                    background: template.colors.background,
                    color: template.colors.text,
                  }}
                >
                  <p className="text-sm font-semibold" style={{ fontFamily: styleConfig.font }}>
                    {template.name}
                  </p>
                  <p className="text-xs opacity-70 mt-1" style={{ fontFamily: styleConfig.font }}>
                    Your Valentine
                  </p>
                </div>
              </div>
            </div>
          )}

          {styleConfig.layout === "split" && (
            <div className="min-h-[140px] flex items-center justify-center py-2">
              <div className="w-[180px] h-[120px] rounded-xl overflow-hidden shadow-md border border-black/10 flex flex-row">
                {/* Image area */}
                <div
                  className="w-2/5 flex items-center justify-center text-xl"
                  style={{
                    background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.accent})`,
                  }}
                >
                  💌
                </div>
                {/* Text area */}
                <div
                  className="w-3/5 flex flex-col items-center justify-center text-center px-2"
                  style={{
                    background: template.colors.background,
                    color: template.colors.text,
                  }}
                >
                  <p className="text-sm font-semibold" style={{ fontFamily: styleConfig.font }}>
                    {template.name}
                  </p>
                  <p className="text-xs opacity-70 mt-1" style={{ fontFamily: styleConfig.font }}>
                    Your Valentine
                  </p>
                </div>
              </div>
            </div>
          )}

          {styleConfig.layout === "fullscreen" && (
            <div className="min-h-[140px] flex items-center justify-center py-2">
              <div className="relative w-[160px] h-[120px]">
                {/* Back card — offset to peek out behind */}
                <div
                  className="absolute inset-0 top-3 left-4 rounded-xl rotate-6 shadow-sm border border-black/10 flex flex-col items-center justify-center text-center p-3"
                  style={{
                    background: template.colors.background,
                    color: template.colors.text,
                  }}
                >
                  <p className="text-sm font-semibold" style={{ fontFamily: styleConfig.font }}>
                    {template.name}
                  </p>
                  <p className="text-xs opacity-70 mt-1" style={{ fontFamily: styleConfig.font }}>
                    Flip to read
                  </p>
                </div>
                {/* Front card — on top */}
                <div
                  className="absolute inset-0 rounded-xl -rotate-6 shadow-md border border-black/10 flex items-center justify-center text-3xl"
                  style={{
                    background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.accent})`,
                  }}
                >
                  💌
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
