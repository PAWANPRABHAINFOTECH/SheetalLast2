import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { DonationModal } from '@/components/shared/DonationModal'
import { FloatingActions } from '@/components/shared/FloatingActions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MapPin, Phone, Mail } from 'lucide-react'
import { useSiteSettings } from '@/lib/temple.hooks'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

function ContactPage() {
  const { data: settings } = useSiteSettings()

  return (
    <div className="min-h-screen bg-background font-hindi">
      <Header />
      <main className="py-16 container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-12 text-center">संपर्क करें</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-primary">हमसे संपर्क करें</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <MapPin className="h-6 w-6 text-secondary shrink-0" />
                <p className="text-lg">{settings?.address || "शीतल सिटीज, मंडीदीप, रायसेन"}</p>
              </div>
              <div className="flex gap-4">
                <Phone className="h-6 w-6 text-secondary shrink-0" />
                <p className="text-lg">{settings?.phone}</p>
              </div>
              <div className="flex gap-4">
                <Mail className="h-6 w-6 text-secondary shrink-0" />
                <p className="text-lg">{settings?.email}</p>
              </div>
            </div>
          </div>
          <form className="space-y-6 bg-card p-8 rounded-3xl shadow-xl border border-primary/10">
            <div className="space-y-2">
              <label className="font-bold">पूरा नाम</label>
              <Input placeholder="अपना नाम लिखें" />
            </div>
            <div className="space-y-2">
              <label className="font-bold">मोबाइल नंबर</label>
              <Input placeholder="अपना मोबाइल नंबर लिखें" />
            </div>
            <div className="space-y-2">
              <label className="font-bold">संदेश</label>
              <Textarea placeholder="अपना संदेश यहाँ लिखें" className="min-h-[150px]" />
            </div>
            <Button className="w-full py-6 text-lg bg-primary">संदेश भेजें</Button>
          </form>
        </div>
      </main>
      <Footer />
      <DonationModal />
      <FloatingActions />
    </div>
  )
}
