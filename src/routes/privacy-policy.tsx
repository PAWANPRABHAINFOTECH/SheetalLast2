import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { DonationModal } from '@/components/shared/DonationModal'
import { FloatingActions } from '@/components/shared/FloatingActions'

export const Route = createFileRoute('/privacy-policy')({
  component: PolicyPage,
})

function PolicyPage() {
  return (
    <div className="min-h-screen bg-background font-hindi">
      <Header />
      <main className="py-16 container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-primary mb-8">Privacy Policy</h1>
        <div className="prose prose-lg text-foreground/80">
          <p>शीतल शिवालय समिति की वेबसाइट पर आपका स्वागत है। हम आपकी गोपनीयता का सम्मान करते हैं...</p>
        </div>
      </main>
      <Footer />
      <DonationModal />
      <FloatingActions />
    </div>
  )
}
