import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useIdeas } from "@/hooks/useIdeas";
import { ContentIdeaCard } from "@/components/ideas/IdeaCard";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
  Trash2,
  CheckSquare,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import AddButton from "@/components/ui/add-button";
import { CreateModal } from "@/components/ideas/CreateModal";
import useDeleteIdea from "@/hooks/useDeleteIdea";
import toast, { Toaster } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_sidebarLayout/ideas")({
  component: RouteComponent,
});

function RouteComponent() {
  const [selectedIdeaIds, setSelectedIdeaIds] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { mutateAsync: deleteIdea, isPending: isDeletingIdea } =
    useDeleteIdea();
  const queryClient = useQueryClient();
  const limit = 9;

  const { data, isLoading, error, isError, refetch } = useIdeas({
    page,
    limit,
  });

  const ideas = data?.data?.data || [];
  const totalPages = data?.data?.pagination?.totalPages || 1;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);

      if (selectionMode) {
        cancelSelection();
      }
    }
  };

  const handleDeleteIdea = (ideaId: string) => {
    setSelectionMode(true);
    setSelectedIdeaIds([ideaId]);
  };

  const toggleIdeaSelection = (ideaId: string) => {
    if (!selectionMode) {
      setSelectionMode(true);
    }
    setSelectedIdeaIds((prev) =>
      prev.includes(ideaId)
        ? prev.filter((id) => id !== ideaId)
        : [...prev, ideaId]
    );
  };

  const cancelSelection = () => {
    setSelectionMode(false);
    setSelectedIdeaIds([]);
  };

  const deleteSelectedIdeas = async () => {
    try {
      const deletePromises = selectedIdeaIds.map((ideaId) =>
        toast.promise(
          deleteIdea(ideaId, {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["ideas"] });
            },
          }),
          {
            loading: `Deleting idea${selectedIdeaIds.length > 1 ? "s" : ""}...`,
            success: `Idea${selectedIdeaIds.length > 1 ? "s" : ""} deleted successfully!`,
            error: (err) =>
              `Delete failed: ${err instanceof Error ? err.message : "Unknown error"}`,
          }
        )
      );
      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Failed to delete ideas:", error);
      toast.error("Failed to delete ideas");
    } finally {
      setSelectedIdeaIds([]);
      setSelectionMode(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Content Ideas</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="rounded-xl bg-background/80 border border-border p-5 shadow-sm"
              >
                <div className="space-y-3">
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="mt-6 flex justify-end">
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Content Ideas</h1>
        <div className="bg-background/80 border border-destructive/20 rounded-lg p-6">
          <div className="flex flex-col items-center text-center max-w-md mx-auto py-8">
            <AlertCircle className="h-10 w-10 text-destructive mb-4" />
            <h3 className="font-semibold text-lg mb-2">Failed to load ideas</h3>
            <p className="text-muted-foreground mb-4">
              {error.message ||
                "An unexpected error occurred. Please try again later."}
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (ideas.length === 0) {
    return (
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Content Ideas</h1>
        <div className="flex flex-col items-center justify-center bg-background/80 border border-border rounded-lg py-12">
          <p className="text-muted-foreground mb-4">No ideas found.</p>
          <Button variant="outline" onClick={() => setIsCreateModalOpen(true)}>
            Create Your First Idea
          </Button>
          {isCreateModalOpen && (
            <CreateModal
              onClose={() => setIsCreateModalOpen(false)}
              onAddIdeas={async () => {
                await refetch();
              }}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <Toaster position="top-center" />

      {isCreateModalOpen && (
        <CreateModal
          onClose={() => setIsCreateModalOpen(false)}
          onAddIdeas={async () => {
            await refetch();
          }}
        />
      )}

      {/* Selection Mode Controls */}
      {selectionMode && (
        <div className="bg-[#DEF0EA] p-4 rounded-xl mb-6 sticky top-0 z-10 shadow-md">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <CheckSquare className="h-5 w-5 text-[var(--cf-primary-green)] mr-2" />
              <span className="font-medium text-[#1a1a2e]">
                {selectedIdeaIds.length}{" "}
                {selectedIdeaIds.length === 1 ? "idea" : "ideas"} selected
              </span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={cancelSelection}
                className="px-3 py-1.5 border border-[#E5F2EE] rounded-md hover:bg-white text-sm font-medium flex items-center"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </button>
              <button
                onClick={deleteSelectedIdeas}
                disabled={selectedIdeaIds.length === 0 || isDeletingIdea}
                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-6">Content Ideas</h1>
        <AddButton
          onClick={() => setIsCreateModalOpen(true)}
          text="Create Idea"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas.map((idea) => {
          const isSelected = selectedIdeaIds.includes(idea._id);
          const isDeletingThisIdea = isDeletingIdea && isSelected;

          return (
            <div
              key={idea._id}
              className={`${isDeletingThisIdea ? "opacity-50" : ""}`}
            >
              {isDeletingThisIdea ? (
                <div className="w-full h-full flex items-center justify-center p-10 rounded-xl bg-[#DEF0EA]/80 border border-white/20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--cf-primary-green)]"></div>
                </div>
              ) : (
                <ContentIdeaCard
                  idea={idea}
                  isSelected={isSelected}
                  onSelect={() => {
                    toggleIdeaSelection(idea._id);
                  }}
                  onDelete={handleDeleteIdea}
                  selectionMode={selectionMode}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-between mt-8">
        <div className="text-sm text-muted-foreground">
          Showing page {page} of {totalPages}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
