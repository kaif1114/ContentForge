import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_sidebarLayout/posts')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_sidebarLayout/posts"!</div>
}
