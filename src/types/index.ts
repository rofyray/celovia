export interface Memory {
  title: string;
  description: string;
}

export interface StyleConfig {
  colorTheme: string;
  font: string;
  layout: "centered" | "split" | "fullscreen";
}

export type TemplateId = "classic" | "bold" | "playful" | "minimal";
export type RsvpStatus = "pending" | "accepted" | "declined";

export interface Invitation {
  id: string;
  sender_name: string;
  recipient_name: string;
  template_id: TemplateId;
  memories: Memory[];
  hints: string | null;
  style_config: StyleConfig;
  generated_message: string | null;
  generated_image_url: string | null;
  access_token: string;
  rsvp_status: RsvpStatus;
  rsvp_message: string | null;
  opened_at: string | null;
  created_at: string;
}

export interface GeneratedMessage {
  message: string;
  tagline: string;
  storyArc: string;
}

export interface Template {
  id: TemplateId;
  name: string;
  description: string;
  tonePrompt: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: string[];
  defaultStyle: StyleConfig;
}
