import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { logEvent } from "@/lib/analytics";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("invitations")
      .select("*")
      .eq("access_token", token)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    // Record opened_at on first view
    if (!data.opened_at) {
      await supabase
        .from("invitations")
        .update({ opened_at: new Date().toISOString() })
        .eq("id", data.id);

      logEvent({
        eventType: "invitation_opened",
        invitationId: data.id,
        properties: {
          template_id: data.template_id,
        },
        request,
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch invitation error:", error);
    return NextResponse.json(
      { error: "Failed to fetch invitation" },
      { status: 500 }
    );
  }
}
