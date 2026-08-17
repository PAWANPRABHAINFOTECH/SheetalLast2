import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { DonationModal } from '@/components/shared/DonationModal'
import { FloatingActions } from '@/components/shared/FloatingActions'
import { LiveDarshan } from '@/components/home/LiveDarshan'

export const Route = createFileRoute('/live-darshan')({
  component: LiveDarshanPage,
})

function LiveDarshanPage() {
  return (
    <div className="min-h-screen bg-background font-hindi">
      <Header />
      <main className="py-16 container mx-auto px-4">
        <LiveDarshan />
      </main>
      <Footer />
      <DonationModal />
      <FloatingActions />
    </div>
  )
}
