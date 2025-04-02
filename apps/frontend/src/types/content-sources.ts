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
  