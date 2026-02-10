import { NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase";

export type AnalyticsEventType =
  | "message_generated"
  | "image_generated"
  | "invitation_created"
  | "invitation_opened"
  | "rsvp_submitted";

interface LogEventParams {
  eventType: AnalyticsEventType;
  invitationId?: string;
  properties?: Record<string, unknown>;
  request?: NextRequest;
}

export function logEvent({
  eventType,
  invitationId,
  properties = {},
  request,
}: LogEventParams): void {
  const enrichedProperties: Record<string, unknown> = { ...properties };

  if (request) {
    enrichedProperties.ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      null;
    enrichedProperties.userAgent = request.headers.get("user-agent") || null;
  }

  const supabase = createServerClient();

  Promise.resolve(
    supabase.from("analytics_events").insert({
      event_type: eventType,
      invitation_id: invitationId || null,
      properties: enrichedProperties,
    })
  )
    .then(({ error }) => {
      if (error) {
        console.error("Analytics insert error:", error);
      }
    })
    .catch((err) => {
      console.error("Analytics error:", err);
    });
}
