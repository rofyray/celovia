import { z } from "zod/v4";

export const memorySchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(1, "Description is required").max(1000),
});

export const createInvitationSchema = z.object({
  senderName: z.string().min(1, "Your name is required").max(100),
  recipientName: z.string().min(1, "Their name is required").max(100),
  templateId: z.enum(["classic", "bold", "playful", "minimal"]),
  memories: z.array(memorySchema).min(1).max(3),
  imageDescription: z.string().min(1, "Image description is required").max(1000),
  hints: z.string().max(1000).optional(),
  styleConfig: z.object({
    colorTheme: z.string(),
    font: z.string(),
    layout: z.enum(["centered", "split", "fullscreen"]),
  }),
});

export const generateMessageSchema = z.object({
  senderName: z.string().min(1),
  recipientName: z.string().min(1),
  templateId: z.enum(["classic", "bold", "playful", "minimal"]),
  memories: z.array(memorySchema).min(1).max(3),
  hints: z.string().optional(),
});

export const generateImageSchema = z.object({
  templateId: z.enum(["classic", "bold", "playful", "minimal"]),
  senderName: z.string().min(1),
  recipientName: z.string().min(1),
  tagline: z.string().optional(),
  memories: z.array(memorySchema).min(1).max(3),
  imageDescription: z.string().min(1, "Image description is required").max(1000),
  hints: z.string().optional(),
});

export const rsvpSchema = z.object({
  status: z.enum(["accepted", "declined"]),
  message: z.string().max(500).optional(),
});

export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;
export type GenerateMessageInput = z.infer<typeof generateMessageSchema>;
export type GenerateImageInput = z.infer<typeof generateImageSchema>;
export type RsvpInput = z.infer<typeof rsvpSchema>;
