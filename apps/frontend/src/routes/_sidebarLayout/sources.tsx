import { Button } from '@/components/ui/button'
import { ContentSource } from '@/types/content-sources'
import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { AddSourceModal } from '../../components/sources/Modal'
import { ContentViewModal } from '../../components/sources/ContentViewModal'
import { ContentSourcesList } from '../../components/sources/List'
import { useContentSources } from '@/hooks/useContentSources'

export const Route = createFileRoute('/_sidebarLayout/sources')({
  component: RouteComponent,
})


// Dummy scraped conten

export default function RouteComponent() {

  const { data: sources, isLoading, isError, error } = useContentSources();
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedSource, setSelectedSource] = useState<ContentSource | null>(null)
  const [isViewLoading, setIsViewLoading] = useState(false)


  const handleViewContent = (source: ContentSource) => {
    setSelectedSource(source)
  }

  const handleAddSource = async () => {
  }
  if(isError){
    return <div>Error: {error?.message}</div>
  }
  if(isLoading){
    return <div>Loading...</div>
  }
  if(sources)
  return (
    <>
      <div className="space-y-6 px-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold pt-4 pb-8">Content Sources</h1>
          <Button onClick={() => setShowAddModal(true)} className="bg-wayflyer-green hover:bg-wayflyer-green/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Source
          </Button>
        </div>

        {/* Content Sources List */}
        <ContentSourcesList sources={sources.data} isLoading={isLoading} onViewContent={handleViewContent} />

        {/* Add Content Source Modal */}
        <AddSourceModal open={showAddModal} onOpenChange={setShowAddModal} onSubmit={handleAddSource} />

        
        {selectedSource && (
          <ContentViewModal
            source={selectedSource}
            open={selectedSource == null ? false : true}
            onClose={() => {
              setSelectedSource(null)
            }}
          />
        )}
      </div>
    </>
  )
}

