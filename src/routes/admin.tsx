import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  ssr: false,
  head: () => ({
    meta: [
      { title: 'शीतल शिवालय समिति | एडमिन पैनल' },
      { name: 'robots', content: 'noindex, nofollow' },
      { name: 'description', content: 'शीतल शिवालय समिति वेबसाइट प्रबंधन पैनल।' },
    ],
  }),
  component: () => <Outlet />,
})
