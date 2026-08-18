import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Loader2, MapPin, Phone, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { DonationModal } from '@/components/shared/DonationModal'
import { FloatingActions } from '@/components/shared/FloatingActions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useSiteSettings } from '@/lib/temple.hooks'
import { supabase } from '@/integrations/supabase/client'

export const Route = createFileRoute('/contact')({
  head: () => ({
    meta: [
      { title: 'संपर्क करें | शीतल शिवालय समिति, मंडीदीप' },
      {
        name: 'description',
        content:
          'शीतल शिवालय समिति, शीतल सिटी मंडीदीप (रायसेन) से संपर्क करें — पता, फ़ोन, ईमेल और संदेश भेजने की सुविधा।',
      },
      { property: 'og:title', content: 'संपर्क करें | शीतल शिवालय समिति' },
      {
        property: 'og:description',
        content: 'मंदिर समिति से संपर्क करें और अपना संदेश भेजें।',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: ContactPage,
})

const enquirySchema = z.object({
  full_name: z.string().trim().min(2, 'कृपया अपना नाम लिखें').max(100),
  mobile: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{10,15}$/, 'कृपया सही मोबाइल नंबर लिखें'),
  email: z.string().trim().email('कृपया सही ईमेल लिखें').max(255).optional().or(z.literal('')),
  message: z.string().trim().min(2, 'कृपया संदेश लिखें').max(1000),
})

function ContactPage() {
  const { data: settings } = useSiteSettings()
  const [form, setForm] = useState({ full_name: '', mobile: '', email: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const parsed = enquirySchema.safeParse(form)
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? 'कृपया विवरण जाँचें')
      return
    }
    setSubmitting(true)
    const { error } = await supabase.from('contact_enquiries').insert({
      full_name: parsed.data.full_name,
      mobile: parsed.data.mobile,
      email: parsed.data.email || null,
      message: parsed.data.message,
    })
    setSubmitting(false)
    if (error) {
      toast.error('संदेश भेजने में त्रुटि हुई, कृपया पुनः प्रयास करें')
      return
    }
    toast.success('आपका संदेश प्राप्त हो गया, धन्यवाद!')
    setForm({ full_name: '', mobile: '', email: '', message: '' })
  }

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
                <p className="text-lg">{settings?.address || "शीतल सिटी, मंडीदीप, रायसेन"}</p>
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
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-card p-8 rounded-3xl shadow-xl border border-primary/10"
          >
            <div className="space-y-2">
              <label className="font-bold">पूरा नाम</label>
              <Input
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                maxLength={100}
                placeholder="अपना नाम लिखें"
              />
            </div>
            <div className="space-y-2">
              <label className="font-bold">मोबाइल नंबर</label>
              <Input
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                maxLength={15}
                placeholder="अपना मोबाइल नंबर लिखें"
              />
            </div>
            <div className="space-y-2">
              <label className="font-bold">ईमेल (वैकल्पिक)</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                maxLength={255}
                placeholder="अपना ईमेल लिखें"
              />
            </div>
            <div className="space-y-2">
              <label className="font-bold">संदेश</label>
              <Textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                maxLength={1000}
                placeholder="अपना संदेश यहाँ लिखें"
                className="min-h-[150px]"
              />
            </div>
            <Button type="submit" disabled={submitting} className="w-full py-6 text-lg bg-primary">
              {submitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              संदेश भेजें
            </Button>
          </form>
        </div>
      </main>
      <Footer />
      <DonationModal />
      <FloatingActions />
    </div>
  )
}
