"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EnvelopeAnimation from "@/components/recipient/EnvelopeAnimation";
import InvitationCard from "@/components/recipient/InvitationCard";
import Celebration from "@/components/recipient/Celebration";
import type { Invitation } from "@/types";

type ViewState = "loading" | "envelope" | "invitation" | "celebration" | "error";

export default function RecipientPage() {
  const params = useParams();
  const token = params.token as string;

  const [viewState, setViewState] = useState<ViewState>("loading");
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInvitation() {
      try {
        const res = await fetch(`/api/invitations/${token}`);
        if (!res.ok) {
          setError("Invitation not found");
          setViewState("error");
          return;
        }
        const data = await res.json();
        setInvitation(data);

        if (data.rsvp_status === "accepted") {
          setViewState("celebration");
        } else {
          setViewState("envelope");
        }
      } catch {
        setError("Something went wrong");
        setViewState("error");
      }
    }

    fetchInvitation();
  }, [token]);

  const handleEnvelopeOpen = () => {
    setViewState("invitation");
  };

  const handleRsvp = async () => {
    try {
      const res = await fetch(`/api/invitations/${token}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "accepted" }),
      });

      if (res.ok) {
        setViewState("celebration");
      }
    } catch {
      // Silently fail — still show celebration for UX
      setViewState("celebration");
    }
  };

  if (viewState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-rose-400 animate-pulse-soft text-lg">
          Loading your invitation...
        </div>
      </div>
    );
  }

  if (viewState === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-4xl mb-4">😔</div>
          <h2 className="text-xl font-semibold text-rose-900 mb-2">
            {error || "Invitation not found"}
          </h2>
          <p className="text-rose-700/60">
            This invitation link may be invalid or expired.
          </p>
        </div>
      </div>
    );
  }

  if (viewState === "envelope") {
    return <EnvelopeAnimation onComplete={handleEnvelopeOpen} />;
  }

  if (viewState === "celebration" && invitation) {
    return <Celebration senderName={invitation.sender_name} />;
  }

  if (viewState === "invitation" && invitation) {
    return <InvitationCard invitation={invitation} onRsvp={handleRsvp} />;
  }

  return null;
}
