import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { DonationModal } from '@/components/shared/DonationModal'
import { FloatingActions } from '@/components/shared/FloatingActions'
import { LocationSection } from '@/components/home/LocationSection'

export const Route = createFileRoute('/location')({
  component: LocationPage,
})

function LocationPage() {
  return (
    <div className="min-h-screen bg-background font-hindi">
      <Header />
      <main className="py-16 container mx-auto px-4">
        <LocationSection />
      </main>
      <Footer />
      <DonationModal />
      <FloatingActions />
    </div>
  )
}
