import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { rsvpSchema } from "@/lib/schemas";
import { logEvent } from "@/lib/analytics";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = await request.json();
    const parsed = rsvpSchema.parse(body);

    const supabase = createServerClient();

    // Verify invitation exists
    const { data: invitation, error: fetchError } = await supabase
      .from("invitations")
      .select("id, rsvp_status")
      .eq("access_token", token)
      .single();

    if (fetchError || !invitation) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    // Update RSVP
    const { error: updateError } = await supabase
      .from("invitations")
      .update({
        rsvp_status: parsed.status,
        rsvp_message: parsed.message || null,
      })
      .eq("id", invitation.id);

    if (updateError) {
      console.error("RSVP update error:", updateError);
      return NextResponse.json(
        { error: "Failed to record RSVP" },
        { status: 500 }
      );
    }

    logEvent({
      eventType: "rsvp_submitted",
      invitationId: invitation.id,
      properties: {
        rsvp_status: parsed.status,
        has_message: !!parsed.message,
        previous_status: invitation.rsvp_status,
      },
      request,
    });

    return NextResponse.json({ success: true, status: parsed.status });
  } catch (error) {
    console.error("RSVP error:", error);
    return NextResponse.json(
      { error: "Failed to record RSVP" },
      { status: 500 }
    );
  }
}
