export interface ContentSource {
    id: string
    label: string
    url: string
    type: "url" | "youtube"
    createdAt: string
  }
  
  export interface ContentItem {
    type: "text" | "video" | "image"
    content: string
    thumbnail?: string
  }
  
  export interface ScrapedContent {
    title: string
    content: ContentItem[]
    lastUpdated: string
  }
  
  