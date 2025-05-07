export type tones =
  | "professional"
  | "narrative"
  | "informative"
  | "persuasive"
  | "casual"
  | "formal"
  | "enthusiastic"
  | "neutral";

export type length = "short" | "medium" | "long";

export const tonesArray = [
  "professional",
  "narrative",
  "informative",
  "persuasive",
  "casual",
  "formal",
  "enthusiastic",
  "neutral",
] as const;

export const lengthArray = ["short", "medium", "long"] as const;
