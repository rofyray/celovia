import { NextRequest, NextResponse } from "next/server";
import { getGenAIClient } from "@/lib/genai";
import { generateImageSchema } from "@/lib/schemas";
import { getTemplate } from "@/lib/templates";
import { logEvent } from "@/lib/analytics";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = generateImageSchema.parse(body);

    const template = getTemplate(parsed.templateId);

    const styleDescriptions: Record<string, string> = {
      classic:
        "soft pastel watercolor style, elegant floral elements, roses and peonies, gentle light, dreamy romantic atmosphere",
      bold: "rich dramatic style, deep reds and golds, bold brush strokes, passionate and cinematic, luxury feel",
      playful:
        "bright colorful illustration style, fun whimsical elements, hearts and stars, cheerful and joyful mood",
      minimal:
        "clean minimalist style, subtle line art, elegant typography-inspired, lots of white space, understated beauty",
    };

    const prompt = `Create a beautiful Valentine's Day invitation artwork. Style: ${styleDescriptions[parsed.templateId] || styleDescriptions.classic}.
The image should feature romantic elements appropriate for an invitation from ${parsed.senderName} to ${parsed.recipientName}.
${parsed.tagline ? `Mood: "${parsed.tagline}". ` : ""}
Do not include any text or letters in the image. Focus on beautiful visual art only.
Color palette: use colors similar to ${template.colors.primary} and ${template.colors.secondary}.
Aspect ratio: landscape, suitable as a header image for a digital invitation card.`;

    const genai = getGenAIClient();
    const response = await genai.models.generateContent({
      model: "gemini-2.5-flash-preview-05-20",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseModalities: ["image", "text"],
      },
    });

    // Extract image from response
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData?.data) {
          const mimeType = part.inlineData.mimeType || "image/png";
          const imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;

          logEvent({
            eventType: "image_generated",
            properties: {
              template_id: parsed.templateId,
              fallback_used: false,
            },
            request,
          });

          return NextResponse.json({ imageUrl });
        }
      }
    }

    // Fallback: return a CSS gradient placeholder
    logEvent({
      eventType: "image_generated",
      properties: {
        template_id: parsed.templateId,
        fallback_used: true,
      },
      request,
    });

    return NextResponse.json({
      imageUrl: null,
      fallback: true,
    });
  } catch (error) {
    console.error("Image generation error:", error);

    logEvent({
      eventType: "image_generated",
      properties: {
        template_id: "unknown",
        fallback_used: true,
      },
      request,
    });

    return NextResponse.json({
      imageUrl: null,
      fallback: true,
    });
  }
}
