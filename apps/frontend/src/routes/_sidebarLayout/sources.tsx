import { ContentSource } from '@/types/content'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { AddSourceModal } from '../../components/sources/Modal'
import { ContentViewModal } from '../../components/sources/ContentViewModal'
import { ContentSourcesList } from '../../components/sources/List'
import { useContentSources } from '@/hooks/useContentSources'
import AddButton from '@/components/ui/add-button'
export const Route = createFileRoute('/_sidebarLayout/sources')({
  component: RouteComponent,
})


// Dummy scraped conten

export default function RouteComponent() {

  const { data: sources, isLoading, isError, error, refetch } = useContentSources();
  
  const [selectedSource, setSelectedSource] = useState<ContentSource | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const handleViewContent = (source: ContentSource) => {
    setSelectedSource(source)
  }

  const handleRetry = () => {
    refetch();
  }

  return (
    <div className='w-full'>
      <div className="space-y-6 px-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold pt-4 pb-8">Content Sources</h1>
          <AddButton onClick={() => setShowAddModal(true)} text="Add Source" />
        </div>

        {/* Content Sources List */}
        <ContentSourcesList 
          sources={sources?.data || []} 
          onViewContent={handleViewContent}
          isLoading={isLoading}
          isError={isError}
          errorMessage="Failed to load content sources. Please try again."
          onRetry={handleRetry}
        />

        {/* Add Content Source Modal */}
        <AddSourceModal open={showAddModal} onOpenChange={setShowAddModal} onAdd={async ()=> await refetch()} />

        
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
    </div>
  )
}

