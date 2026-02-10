import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { generateMessageSchema } from "@/lib/schemas";
import { getTemplate } from "@/lib/templates";
import { logEvent } from "@/lib/analytics";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = generateMessageSchema.parse(body);

    const template = getTemplate(parsed.templateId);

    const memoriesText = parsed.memories
      .map((m, i) => `${i + 1}. "${m.title}": ${m.description}`)
      .join("\n");

    const response = await openai.chat.completions.create({
      model: "gpt-5-nano",
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "invitation_message",
          strict: true,
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description:
                  "The poetic invitation text, 2-4 paragraphs. Warm, personal, romantic.",
              },
              tagline: {
                type: "string",
                description:
                  "A short romantic tagline (one line, under 10 words).",
              },
              storyArc: {
                type: "string",
                description:
                  "A brief narrative summary of their love story (1-2 sentences).",
              },
            },
            required: ["message", "tagline", "storyArc"],
            additionalProperties: false,
          },
        },
      },
      messages: [
        {
          role: "system",
          content: `You are a gifted romantic writer creating a Valentine's Day invitation. ${template.tonePrompt}

Rules:
- Write in second person, addressing the recipient by name
- Weave in the shared memories naturally — don't just list them
- The message should feel deeply personal, not generic
- Never be cheesy or cliché — aim for genuine, modern romance
- Keep the tagline short and memorable
- The story arc should summarize their journey together
- Never use em-dashes (—) — use commas, periods, or semicolons instead`,
        },
        {
          role: "user",
          content: `Create a Valentine's invitation from ${parsed.senderName} to ${parsed.recipientName}.

Their shared memories:
${memoriesText}

${parsed.hints ? `Personal hints and context: ${parsed.hints}` : ""}

Write a beautiful, personalized invitation message.`,
        },
      ],
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return NextResponse.json(
        { error: "No content generated" },
        { status: 500 }
      );
    }

    const result = JSON.parse(content);

    logEvent({
      eventType: "message_generated",
      properties: {
        template_id: parsed.templateId,
        memories_count: parsed.memories.length,
        has_hints: !!parsed.hints,
      },
      request,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Message generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate message" },
      { status: 500 }
    );
  }
}
