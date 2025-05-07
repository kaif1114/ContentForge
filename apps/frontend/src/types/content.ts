export interface ContentSource {
  _id: string;
  label: string;
  url: string;
  type: "url" | "youtube";
  createdAt: string;
  content: string;
  posts: {
    id: string;
    title: string;
    description: string;
    platform: "x" | "linkedin" | "both";
  }[];
}

export type Post = {
  _id: string;
  title: string;
  description: string;
  tone:
    | "professional"
    | "narrative"
    | "informative"
    | "persuasive"
    | "casual"
    | "formal"
    | "enthusiastic"
    | "neutral";
  platform: "x" | "linkedin" | "both";
  createdAt: string;
  sourceTitle: string;
  sourceId: string;
  tags: string[];
} & (
  | {
      length: "short" | "medium" | "long";
      customLength?: never;
    }
  | {
      length?: never;
      customLength: number;
    }
);

export type PostData = {
  contentId: string;
  templateId: string;
  tone: string;
  postCount: number;
  customPrompt: string;
  platform: "linkedin" | "x" | "both";
} & (
  | {
      length: "short" | "medium" | "long";
      customLength?: never;
    }
  | {
      length?: never;
      customLength: number;
    }
);
