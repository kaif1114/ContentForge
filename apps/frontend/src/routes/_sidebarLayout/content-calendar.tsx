import ContentCalendar from "@/components/content-calendar/ContentCalendar";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_sidebarLayout/content-calendar")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container mx-auto p-4">
      <ContentCalendar />
    </div>
  );
}
