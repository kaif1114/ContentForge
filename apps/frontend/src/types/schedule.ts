import { Post } from "./content";

export interface Schedule {
  _id: string;
  scheduleDate: string;
  platform: "linkedin" | "x" | "both";
  post: Post;
}
