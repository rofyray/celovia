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

    const prompt = `Create a beautiful Valentine's Day invitation artwork. Style: ${styleDescriptions[parsed.templateId] || styleDescriptions.classic}.
The image should feature romantic elements appropriate for an invitation from ${parsed.senderName} to ${parsed.recipientName}.
${parsed.tagline ? `Mood: "${parsed.tagline}". ` : ""}
Do not include any text or letters in the image. Focus on beautiful visual art only.
Color palette: use colors similar to ${template.colors.primary} and ${template.colors.secondary}.
Aspect ratio: landscape, suitable as a header image for a digital invitation card.`;

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
