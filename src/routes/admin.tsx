import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  ssr: false,
  head: () => ({
    meta: [
      { title: 'एडमिन पैनल | शीतल शिवालय समिति' },
      { name: 'robots', content: 'noindex, nofollow' },
      { name: 'description', content: 'शीतल शिवालय समिति वेबसाइट प्रबंधन पैनल।' },
    ],
  }),
  component: () => <Outlet />,
})
