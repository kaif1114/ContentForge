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
      platform: "twitter" | "linkedin"
    }[]
}

export interface Post{
  _id: string
  title: string
  description: string
  platform: "twitter" | "linkedin"
  createdAt: string
  sourceTitle: string
  sourceId: string
  tags: string[]
}
  