import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useIdeas } from "@/hooks/useIdeas";
import { ContentIdeaCard } from "@/components/ideas/IdeaCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_sidebarLayout/ideas")({
  component: RouteComponent,
});

function RouteComponent() {
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error, isError } = useIdeas({ page, limit });

  const ideas = data?.data?.data || [];
  const totalPages = data?.data?.pagination?.totalPages || 1;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      setSelectedIdeaId(null);
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
          <Button variant="outline">Create Your First Idea</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Content Ideas</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas.map((idea) => (
          <ContentIdeaCard
            key={idea._id}
            idea={idea}
            isSelected={idea._id === selectedIdeaId}
            onSelect={() =>
              setSelectedIdeaId(idea._id === selectedIdeaId ? null : idea._id)
            }
          />
        ))}
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
