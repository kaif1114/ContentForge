import { Button } from '@/components/ui/button'
import { ContentSource, ScrapedContent } from '@/types/content-sources'
import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useState, useEffect } from 'react'

import { AddSourceModal } from '../../components/sources/Modal'
import { ContentViewModal } from '../../components/sources/ContentViewModal'
import { ContentSourcesList } from '../../components/sources/List'

export const Route = createFileRoute('/_sidebarLayout/sources')({
  component: RouteComponent,
})

const initialSources: ContentSource[] = [
  {
    id: "1",
    label: "Company Blog",
    url: "https://example.com/blog",
    type: "url",
    createdAt: new Date("2023-01-15").toISOString(),
  },
  {
    id: "2",
    label: "Product Updates",
    url: "https://example.com/updates",
    type: "url",
    createdAt: new Date("2023-02-20").toISOString(),
  },
  {
    id: "3",
    label: "Tutorial Videos",
    url: "https://youtube.com/channel/UC123456789",
    type: "youtube",
    createdAt: new Date("2023-03-10").toISOString(),
  },
  {
    id: "4",
    label: "Industry News",
    url: "https://example.com/news",
    type: "url",
    createdAt: new Date("2023-04-05").toISOString(),
  },
]

// Dummy scraped content
const dummyScrapedContent: Record<string, ScrapedContent> = {
  "1": {
    title: "Company Blog",
    content: [
      {
        type: "text",
        content: "Our latest product update brings several new features that our customers have been requesting.",
      },
      { type: "text", content: "We've improved the dashboard with better analytics and reporting capabilities." },
      { type: "text", content: "The new API endpoints allow for more flexible integration with third-party services." },
    ],
    lastUpdated: new Date("2023-05-10").toISOString(),
  },
  "2": {
    title: "Product Updates",
    content: [
      { type: "text", content: "Version 2.5 Release Notes:" },
      { type: "text", content: "- New dashboard interface" },
      { type: "text", content: "- Improved performance for large datasets" },
      { type: "text", content: "- Bug fixes and stability improvements" },
    ],
    lastUpdated: new Date("2023-04-28").toISOString(),
  },
  "3": {
    title: "Tutorial Videos",
    content: [
      {
        type: "video",
        content: "https://youtube.com/embed/abc123",
        thumbnail: "/placeholder.svg?height=180&width=320",
      },
      {
        type: "video",
        content: "https://youtube.com/embed/def456",
        thumbnail: "/placeholder.svg?height=180&width=320",
      },
      {
        type: "video",
        content: "https://youtube.com/embed/ghi789",
        thumbnail: "/placeholder.svg?height=180&width=320",
      },
    ],
    lastUpdated: new Date("2023-03-15").toISOString(),
  },
  "4": {
    title: "Industry News",
    content: [
      {
        type: "text",
        content: "The financial technology sector continues to grow with new innovations in payment processing.",
      },
      {
        type: "text",
        content: "Regulatory changes are expected to impact how fintech companies operate in the European market.",
      },
      { type: "text", content: "Investors are showing increased interest in AI-powered financial tools and services." },
    ],
    lastUpdated: new Date("2023-05-01").toISOString(),
  },
}

export default function RouteComponent() {
  const [sources, setSources] = useState<ContentSource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedSource, setSelectedSource] = useState<ContentSource | null>(null)
  const [scrapedContent, setScrapedContent] = useState<ScrapedContent | null>(null)
  const [isViewLoading, setIsViewLoading] = useState(false)

  // Simulate fetching content sources
  useEffect(() => {
    const fetchSources = async () => {
      setIsLoading(true)
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSources(initialSources)
      setIsLoading(false)
    }

    fetchSources()
  }, [])

  // Simulate fetching content for a source
  const handleViewContent = async (source: ContentSource) => {
    setSelectedSource(source)
    setIsViewLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setScrapedContent(dummyScrapedContent[source.id])
    setIsViewLoading(false)
  }

  // Simulate adding a new content source
  const handleAddSource = async (newSource: Omit<ContentSource, "id" | "createdAt">) => {
    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const createdSource: ContentSource = {
      ...newSource,
      id: `${sources.length + 1}`,
      createdAt: new Date().toISOString(),
    }

    setSources((prev) => [...prev, createdSource])
    setIsLoading(false)
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold pt-4 pb-8">Content Sources</h1>
          <Button onClick={() => setShowAddModal(true)} className="bg-wayflyer-green hover:bg-wayflyer-green/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Source
          </Button>
        </div>

        {/* Content Sources List */}
        <ContentSourcesList sources={sources} isLoading={isLoading} onViewContent={handleViewContent} />

        {/* Add Content Source Modal */}
        <AddSourceModal open={showAddModal} onOpenChange={setShowAddModal} onSubmit={handleAddSource} />

        {/* Content View Modal */}
        {selectedSource && (
          <ContentViewModal
            source={selectedSource}
            content={scrapedContent}
            isLoading={isViewLoading}
            onClose={() => {
              setSelectedSource(null)
              setScrapedContent(null)
            }}
          />
        )}
      </div>
    </>
  )
}

