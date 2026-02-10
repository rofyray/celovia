import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { serverClient as supabase } from "@/lib/supabase";
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

    const personalElements = parsed.memories
      .map((m) => m.description)
      .join("; ");

    const sceneContext = [
      personalElements,
      parsed.hints ? parsed.hints : null,
    ].filter(Boolean).join(". ");

    const prompt = `Create a romantic artwork inspired by this couple's unique story. Their moments together: ${sceneContext}.

Depict a scene, setting, or symbolic imagery drawn from their specific memories above. Make it feel like THEIR story, not a generic Valentine's card.

Style: ${styleDescriptions[parsed.templateId] || styleDescriptions.classic}.
${parsed.tagline ? `Mood: "${parsed.tagline}". ` : ""}
Do not include any text, words, or letters in the image. Pure visual art only.
Color palette: ${template.colors.primary} and ${template.colors.secondary} tones.
Landscape format, suitable as a digital invitation header.`;

    const response = await openai.images.generate({
      model: "gpt-image-1.5",
      prompt,
      n: 1,
      size: "1536x1024",
      quality: "low",
      output_format: "webp",
    });

    const b64 = response.data?.[0]?.b64_json;
    if (b64) {
      // Upload to Supabase Storage instead of returning base64
      const buffer = Buffer.from(b64, "base64");
      const filename = `${crypto.randomUUID()}.webp`;

      const { error: uploadError } = await supabase.storage
        .from("invitation-images")
        .upload(filename, buffer, {
          contentType: "image/webp",
          cacheControl: "31536000",
        });

      let imageUrl: string;
      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        // Fallback to data URL if upload fails
        imageUrl = `data:image/webp;base64,${b64}`;
      } else {
        const { data: publicUrlData } = supabase.storage
          .from("invitation-images")
          .getPublicUrl(filename);
        imageUrl = publicUrlData.publicUrl;
      }

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
