import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { DonationModal, useDonationModal } from '@/components/shared/DonationModal'
import { FloatingActions } from '@/components/shared/FloatingActions'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'

export const Route = createFileRoute('/donate')({
  component: DonatePage,
})

function DonatePage() {
  const { openModal } = useDonationModal()

  return (
    <div className="min-h-screen bg-background font-hindi">
      <Header />
      <main className="py-16 container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          <Heart className="h-20 w-20 text-accent mx-auto fill-current animate-pulse" />
          <h1 className="text-4xl md:text-6xl font-bold text-primary">दान करें</h1>
          <p className="text-xl text-foreground/80 leading-relaxed">
            आपका योगदान मंदिर के निर्माण और सेवा कार्यों में सहायक होगा। कृपया नीचे दिए गए बटन पर क्लिक करके दान विवरण देखें।
          </p>
          <Button size="lg" className="bg-accent text-accent-foreground rounded-full px-12 py-8 text-2xl" onClick={openModal}>
            दान विवरण देखें
          </Button>
        </div>
      </main>
      <Footer />
      <DonationModal />
      <FloatingActions />
    </div>
  )
}
