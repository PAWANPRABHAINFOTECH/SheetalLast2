import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/live-darshan')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/live-darshan"!</div>
}
