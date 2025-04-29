export interface ContentSource {
    _id: string
    label: string
    url: string
    type: "url" | "youtube"
    createdAt: string
    content: string
    posts: {
      id: string
      title: string,
      description: string,
      platform: "x" | "linkedin" | "both"
    }[]
}

export interface Post{
  _id: string
  title: string
  description: string
  platform: "x" | "linkedin" | "both"
  createdAt: string
  sourceTitle: string
  sourceId: string
  tags: string[]
}
  