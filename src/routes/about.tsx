import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { DonationModal } from '@/components/shared/DonationModal'
import { FloatingActions } from '@/components/shared/FloatingActions'
import { useTempleInfo } from '@/lib/temple.hooks'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  const { data: info } = useTempleInfo()
  const content = info?.find(i => i.section_name === 'about')?.content

  return (
    <div className="min-h-screen bg-background font-hindi">
      <Header />
      <main className="py-16 container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-12 text-center">मंदिर के बारे में</h1>
        <div className="prose prose-lg max-w-4xl mx-auto text-foreground/80 leading-relaxed whitespace-pre-line">
          {content || "सामग्री लोड हो रही है..."}
        </div>
      </main>
      <Footer />
      <DonationModal />
      <FloatingActions />
    </div>
  )
}
