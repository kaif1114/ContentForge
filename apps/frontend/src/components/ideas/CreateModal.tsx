import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useContentSources } from "@/hooks/useContentSources";
import { ContentSource } from "@/types/content";

interface CreateModalProps {
  onClose: () => void;
  onSubmit: (selectedSources: string[], numberOfIdeas: number) => void;
}

export function CreateModal({ onClose, onSubmit }: CreateModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [numberOfIdeas, setNumberOfIdeas] = useState<number>(6);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [allSources, setAllSources] = useState<ContentSource[]>([]);
  const { data: contentSourcesResponse, isLoading } = useContentSources({
    page: currentPage,
    limit: 5,
  });

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
    if (selectedSources.includes(sourceId)) {
      setSelectedSources(selectedSources.filter((id) => id !== sourceId));
    } else {
      setSelectedSources([...selectedSources, sourceId]);
    }
  };

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const hasMoreSources =
    contentSourcesResponse?.data.pagination &&
    currentPage < contentSourcesResponse.data.pagination.totalPages;

  const handleSubmit = () => {
    onSubmit(selectedSources, numberOfIdeas);
    onClose();
  };

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

        <h2 className="text-2xl font-bold mb-6">Generate New Ideas</h2>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Select Content Source</h3>
          <Input
            type="text"
            placeholder="Search your content sources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-2"
          />

          <div className="max-h-60 overflow-y-auto space-y-2">
            {filteredSources?.map((source) => (
              <div
                key={source._id}
                className={`flex items-center rounded-lg cursor-pointer text-sm border p-4 ${
                  selectedSources.includes(source._id)
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
            ))}

            {hasMoreSources && (
              <div className="flex justify-center mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Loading..." : "Load More Sources"}
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

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Generate</Button>
        </div>
      </div>
    </div>
  );
}
