import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/layout/Header'
import { NoticeTicker } from '@/components/home/NoticeTicker'
import { HeroSlider } from '@/components/home/HeroSlider'
import { QuickActions } from '@/components/home/QuickActions'
import { AboutTempleSection } from '@/components/home/AboutTempleSection'
import { TempleTimings } from '@/components/home/TempleTimings'
import { LiveDarshan } from '@/components/home/LiveDarshan'
import { NewsSection } from '@/components/home/NewsSection'
import { YouTubeSection } from '@/components/home/YouTubeSection'
import { EventFloatingSlider } from '@/components/home/EventFloatingSlider'
import { ChairmanMessage } from '@/components/home/ChairmanMessage'
import { FeaturedMembers } from '@/components/home/FeaturedMembers'
import { LocationSection } from '@/components/home/LocationSection'
import { GalleryPreview } from '@/components/home/GalleryPreview'
import { Footer } from '@/components/layout/Footer'
import { DonationModal } from '@/components/shared/DonationModal'
import { FloatingActions } from '@/components/shared/FloatingActions'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { CommentsSection } from '@/components/home/CommentsSection'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="min-h-screen bg-background font-hindi" title="शीतल शिवालय समिति | शीतल सिटी मंडीदीप">
      <NoticeTicker />
      <Header />
      <main>
        <HeroSlider />
        <QuickActions />
        
        <section className="py-16 container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <AboutTempleSection />
          </div>
          <div>
            <TempleTimings />
          </div>
        </section>

        <section className="bg-primary/5 py-16">
          <div className="container mx-auto px-4">
            <LiveDarshan />
          </div>
        </section>

        <section className="py-16 container mx-auto px-4">
          <NewsSection />
        </section>

        <YouTubeSection />


        <section className="bg-primary/5 py-16">
          <div className="container mx-auto px-4">
            <ChairmanMessage />
          </div>
        </section>

        <section className="py-16 container mx-auto px-4">
          <FeaturedMembers />
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <LocationSection />
          </div>
        </section>

        <section className="py-16 container mx-auto px-4">
          <GalleryPreview />
        </section>

        <TestimonialsSection />
        
        <CommentsSection />
      </main>
      
      <Footer />
      <DonationModal />
      <FloatingActions />
      <EventFloatingSlider />
    </div>
  )
}
