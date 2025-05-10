import { useState, useEffect } from "react";
import { X, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useContentSources } from "@/hooks/useContentSources";
import { ContentSource } from "@/types/content";
import useAddIdeas from "@/hooks/useCreateIdeas";

interface CreateModalProps {
  onClose: () => void;
  onAddIdeas: () => Promise<void>;
}

export function CreateModal({ onClose, onAddIdeas }: CreateModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState<string>("");
  const [numberOfIdeas, setNumberOfIdeas] = useState<number>(3);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [allSources, setAllSources] = useState<ContentSource[]>([]);
  const {
    data: contentSourcesResponse,
    isLoading,
    isError,
    error,
  } = useContentSources({
    page: currentPage,
    limit: 5,
  });
  const {
    mutateAsync: addIdeas,
    isPending: isAddingIdeas,
    isError: isAddingIdeasError,
    error: addingIdeasError,
  } = useAddIdeas();

  const handleCreateIdea = async () => {
    await addIdeas({ contentId: selectedSource, count: numberOfIdeas });
    await onAddIdeas();
    onClose();
  };

  useEffect(() => {
    if (contentSourcesResponse?.data.data) {
      if (currentPage === 1) {
        setAllSources(contentSourcesResponse.data.data);
      } else {
        setAllSources((prev) => [...prev, ...contentSourcesResponse.data.data]);
      }
    }
  }, [contentSourcesResponse, currentPage]);

  const filteredSources = allSources.filter((source) =>
    source.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectSource = (sourceId: string) => {
    setSelectedSource(sourceId);
  };

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const hasMoreSources =
    contentSourcesResponse?.data.pagination &&
    currentPage < contentSourcesResponse.data.pagination.totalPages;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 backdrop-blur-xs" onClick={onClose} />
      <div className="modal-bg w-full max-w-2xl p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={18} />
        </button>

        <h2 className="text-2xl font-bold mb-6">Create New Ideas</h2>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Select Content Source</h3>
          <Input
            type="text"
            placeholder="Search your content sources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-2"
          />

          {isError && (
            <div className="flex flex-col items-center gap-3 p-4 rounded-lg bg-destructive/10 text-destructive mb-4">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm text-center">
                {error?.message || "Failed to load content sources."}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setCurrentPage(1)}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Try Again
              </Button>
            </div>
          )}

          <div className="max-h-60 overflow-y-auto space-y-2">
            {isLoading ? (
              // Loading skeletons
              Array(3)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="flex items-center rounded-lg border border-border p-4"
                  >
                    <div className="mr-3 h-5 w-16 bg-primary/10 rounded animate-pulse"></div>
                    <div className="w-full">
                      <div className="h-4 w-3/4 bg-primary/10 rounded animate-pulse mb-2"></div>
                      <div className="h-3 w-1/2 bg-primary/10 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))
            ) : filteredSources?.length > 0 ? (
              filteredSources.map((source) => (
                <div
                  key={source._id}
                  className={`flex items-center rounded-lg cursor-pointer text-sm border p-4 ${
                    selectedSource == source._id
                      ? "border-primary bg-primary/10"
                      : "border-border"
                  }`}
                  onClick={() => handleSelectSource(source._id)}
                >
                  <div className="mr-3 text-primary">{source.type}</div>
                  <div>
                    <div className="font-medium">{source.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {source.type}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-4 text-muted-foreground">
                {searchQuery
                  ? "No matching sources found."
                  : "No content sources available."}
              </div>
            )}

            {!isLoading && !isError && hasMoreSources && (
              <div className="flex justify-center mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More Sources"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Number of Ideas</h3>
            <div className="bg-primary/10 text-primary rounded-full w-7 h-7 flex items-center justify-center">
              {numberOfIdeas}
            </div>
          </div>

          <Slider
            defaultValue={[numberOfIdeas]}
            max={10}
            min={1}
            step={1}
            onValueChange={(value) => setNumberOfIdeas(value[0])}
            className="mb-2"
          />

          <div className="flex justify-between text-sm text-muted-foreground">
            <span>1</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {isAddingIdeasError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">
                {addingIdeasError?.message ||
                  "Failed to create ideas. Please try again."}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} className="mr-2">
              Cancel
            </Button>
            <Button
              onClick={handleCreateIdea}
              disabled={selectedSource === "" || isAddingIdeas}
              className="min-w-[100px]"
            >
              {isAddingIdeas ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
