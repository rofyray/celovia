import { NextRequest, NextResponse } from "next/server";
import { serverClient as supabase } from "@/lib/supabase";
import { logEvent } from "@/lib/analytics";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const { data, error } = await supabase
      .from("invitations")
      .select("id, sender_name, recipient_name, template_id, style_config, generated_message, generated_image_url, access_token, rsvp_status, opened_at")
      .eq("access_token", token)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    // Record opened_at on first view (fire-and-forget)
    if (!data.opened_at) {
      supabase
        .from("invitations")
        .update({ opened_at: new Date().toISOString() })
        .eq("id", data.id)
        .then(({ error: updateError }) => {
          if (updateError) console.error("opened_at update error:", updateError);
        });

      logEvent({
        eventType: "invitation_opened",
        invitationId: data.id,
        properties: {
          template_id: data.template_id,
        },
        request,
      });
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Fetch invitation error:", error);
    return NextResponse.json(
      { error: "Failed to fetch invitation" },
      { status: 500 }
    );
  }
}
