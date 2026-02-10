import { Template } from "@/types";

export const templates: Template[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Elegant pastels with soft, timeless romance",
    tonePrompt:
      "Write in an elegant, timeless romantic tone. Use flowing language, gentle metaphors, and a sense of enduring love.",
    colors: {
      primary: "#d4a0b9",
      secondary: "#f2d5e0",
      accent: "#c27ba0",
      background: "#fdf2f8",
      text: "#4a2040",
    },
    fonts: ["Playfair Display", "Lora", "Cormorant Garamond"],
    defaultStyle: {
      colorTheme: "classic",
      font: "Playfair Display",
      layout: "centered",
    },
  },
  {
    id: "bold",
    name: "Bold",
    description: "Deep reds and golds with passionate confidence",
    tonePrompt:
      "Write with passionate confidence and bold declarations of love. Use vivid, dramatic language with a sense of grand romance.",
    colors: {
      primary: "#b91c1c",
      secondary: "#fbbf24",
      accent: "#dc2626",
      background: "#1c1917",
      text: "#fef3c7",
    },
    fonts: ["Bebas Neue", "Oswald", "Raleway"],
    defaultStyle: {
      colorTheme: "bold",
      font: "Bebas Neue",
      layout: "fullscreen",
    },
  },
  {
    id: "playful",
    name: "Playful",
    description: "Bright colors with fun, lighthearted energy",
    tonePrompt:
      "Write in a fun, lighthearted, and playful tone. Use humor, warmth, and a sense of joyful adventure together.",
    colors: {
      primary: "#f472b6",
      secondary: "#a78bfa",
      accent: "#fb923c",
      background: "#fefce8",
      text: "#3b0764",
    },
    fonts: ["Quicksand", "Nunito", "Poppins"],
    defaultStyle: {
      colorTheme: "playful",
      font: "Quicksand",
      layout: "centered",
    },
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean typography with understated modern charm",
    tonePrompt:
      "Write in a clean, understated, and modern tone. Use precise, thoughtful language — let the words carry weight without excess.",
    colors: {
      primary: "#6b7280",
      secondary: "#e5e7eb",
      accent: "#111827",
      background: "#ffffff",
      text: "#111827",
    },
    fonts: ["Inter", "Space Grotesk", "DM Sans"],
    defaultStyle: {
      colorTheme: "minimal",
      font: "Inter",
      layout: "split",
    },
  },
];

export function getTemplate(id: string): Template {
  return templates.find((t) => t.id === id) ?? templates[0];
}
