import { ContentSource } from "@/types/content";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AddSourceModal } from "../../components/sources/Modal";
import { ContentViewModal } from "../../components/sources/ContentViewModal";
import { ContentSourcesList } from "../../components/sources/List";
import { useContentSources } from "@/hooks/useContentSources";
import AddButton from "@/components/ui/add-button";

export const Route = createFileRoute("/_sidebarLayout/sources")({
  component: RouteComponent,
});

export default function RouteComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const {
    data: sourcesResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useContentSources({
    page: currentPage,
    limit: itemsPerPage,
  });

  const [selectedSource, setSelectedSource] = useState<ContentSource | null>(
    null
  );
  const [showAddModal, setShowAddModal] = useState(false);

  const handleViewContent = (source: ContentSource) => {
    setSelectedSource(source);
  };

  const handleRetry = () => {
    refetch();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (
      sourcesResponse?.data.pagination &&
      currentPage < sourcesResponse.data.pagination.totalPages
    ) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-130px)]">
      <div className=" px-2 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold pt-4 pb-8">Content Sources</h1>
          <AddButton onClick={() => setShowAddModal(true)} text="Add Source" />
        </div>

        <div className="min-h-[700px]">
          <ContentSourcesList
            sources={sourcesResponse?.data.data || []}
            onViewContent={handleViewContent}
            isLoading={isLoading}
            isError={isError}
            errorMessage="Failed to load content sources. Please try again."
            onRetry={handleRetry}
          />
        </div>

        {/* Pagination Controls */}
        <div className=" py-4">
          {sourcesResponse?.data.pagination &&
            sourcesResponse.data.pagination.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                >
                  Previous
                </button>
                <div className="flex space-x-2">
                  {Array.from(
                    { length: sourcesResponse.data.pagination.totalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 rounded-full ${
                        currentPage === page
                          ? "bg-primary text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleNextPage}
                  disabled={
                    !sourcesResponse?.data.pagination ||
                    currentPage === sourcesResponse.data.pagination.totalPages
                  }
                  className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
        </div>

        <AddSourceModal
          open={showAddModal}
          onOpenChange={setShowAddModal}
          onAdd={async () => await refetch()}
        />

        {selectedSource && (
          <ContentViewModal
            source={selectedSource}
            open={selectedSource == null ? false : true}
            onClose={() => {
              setSelectedSource(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
