import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/refund-policy')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/refund-policy"!</div>
}
