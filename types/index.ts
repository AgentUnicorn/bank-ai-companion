import {z} from "zod"

export const MODERATION_CATEGORIES = [
    "OFFENSIVE",
    "OFF_BRAND",
    "VIOLENCE",
    "NONE",
] as const;

export type SessionStatus = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'LISTENING' | 'SPEAKING' | 'ERROR';

export type ModerationCategory = (typeof MODERATION_CATEGORIES)[number];

export const ModerationCategoryZod = z.enum([...MODERATION_CATEGORIES]);

export enum AppState {
  IDLE,
  LISTENING,
  THINKING,
  SPEAKING,
}

export type InteractionMode = 'voice' | 'text' | null;

export interface ChatMessage {
    role: 'user' | 'model' | 'system';
    text: string;
    audioBase64?: string;
    audioBase64Chunks?: string[];
    audioUrl?: string;
    action?: {
      key: string;
      text: string;
    };
    tokenCount?: number;
}

export type CompanionId = 'G';

export const GuardrailOutputZod = z.object({
    moderationRationale: z.string(),
    moderationCategory: ModerationCategoryZod,
    testText: z.string().optional(),
});

export type GuardrailOutput = z.infer<typeof GuardrailOutputZod>;

export interface GuardrailResultType {
    status: "IN_PROGRESS" | "DONE";
    testText?: string;
    category?: ModerationCategory;
    rationale?: string;
}

export interface TranscriptItem {
    itemId: string;
    type: "MESSAGE" | "BREADCRUMB";
    role?: "user" | "assistant";
    title?: string;
    data?: Record<string, any>;
    expanded: boolean;
    timestamp: string;
    createdAtMs: number;
    status: "IN_PROGRESS" | "DONE";
    isHidden: boolean;
    guardrailResult?: GuardrailResultType;
}