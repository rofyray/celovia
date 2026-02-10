"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Celebration from "@/components/recipient/Celebration";

export default function AcceptedPage() {
  const params = useParams();
  const token = params.token as string;
  const [senderName, setSenderName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvitation() {
      try {
        const res = await fetch(`/api/invitations/${token}`);
        if (res.ok) {
          const data = await res.json();
          setSenderName(data.sender_name);
        }
      } catch {
        // Use fallback
      } finally {
        setLoading(false);
      }
    }

    fetchInvitation();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-rose-400 animate-pulse-soft text-lg">
          Loading...
        </div>
      </div>
    );
  }

  return <Celebration senderName={senderName || "your Valentine"} />;
}
