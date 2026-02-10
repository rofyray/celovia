import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { logEvent } from "@/lib/analytics";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const accessToken = crypto.randomBytes(16).toString("hex");

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("invitations")
      .insert({
        sender_name: body.senderName,
        recipient_name: body.recipientName,
        template_id: body.templateId,
        memories: body.memories,
        hints: body.hints || null,
        style_config: body.styleConfig,
        generated_message: body.generatedMessage?.message || null,
        generated_image_url: body.generatedImageUrl || null,
        access_token: accessToken,
      })
      .select("id, access_token")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to save invitation" },
        { status: 500 }
      );
    }

    logEvent({
      eventType: "invitation_created",
      invitationId: data.id,
      properties: {
        template_id: body.templateId,
        memories_count: body.memories?.length ?? 0,
        has_generated_message: !!body.generatedMessage,
        has_generated_image: !!body.generatedImageUrl,
      },
      request,
    });

    return NextResponse.json({
      id: data.id,
      accessToken: data.access_token,
    });
  } catch (error) {
    console.error("Save invitation error:", error);
    return NextResponse.json(
      { error: "Failed to save invitation" },
      { status: 500 }
    );
  }
}
