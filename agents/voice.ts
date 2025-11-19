export const OPENAI_AGENT_VOICES = {
    ALLOY: "alloy",
    ASH: "ash",
    BALLAD: "ballad",
    CORAL: "coral",
    ECHO: "echo",
    SAGE: "sage",
    SHIMMER: "shimmer",
    VERSE: "verse",
    MARIN: "marin",
    CEDAR: "cedar",
} as const;

// OPEN AI voice testing link: https://www.openai.fm/
export type OpenAIAgentVoice = typeof OPENAI_AGENT_VOICES[keyof typeof OPENAI_AGENT_VOICES];
