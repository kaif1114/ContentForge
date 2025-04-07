import { Button } from '@/components/ui/button'
import { ContentSource } from '@/types/content'
import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { AddSourceModal } from '../../components/sources/Modal'
import { ContentViewModal } from '../../components/sources/ContentViewModal'
import { ContentSourcesList } from '../../components/sources/List'
import { useContentSources } from '@/hooks/useContentSources'

export const Route = createFileRoute('/_sidebarLayout/sources')({
  component: RouteComponent,
})


// Dummy scraped conten

export default function RouteComponent() {

  const { data: sources, isLoading, isError, error, refetch } = useContentSources();
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedSource, setSelectedSource] = useState<ContentSource | null>(null)


  const handleViewContent = (source: ContentSource) => {
    setSelectedSource(source)
  }

  const handleRetry = () => {
    refetch();
  }

  return (
    <>
      <div className="space-y-6 px-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold pt-4 pb-8">Content Sources</h1>
          <button 
            onClick={() => setShowAddModal(true)} 
            className="flex items-center justify-center gap-1 bg-gradient-to-b from-[#b3dcc7] to-[#a0d2ba] text-white font-medium py-3 px-6 rounded-2xl hover:opacity-90 transition-all"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Add Source</span>
          </button>
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
    </>
  )
}

