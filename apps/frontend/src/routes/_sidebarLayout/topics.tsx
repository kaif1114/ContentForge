import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_sidebarLayout/topics')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_sidebarLayout/topics"!</div>
}
