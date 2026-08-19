import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { DonationModal } from '@/components/shared/DonationModal'
import { FloatingActions } from '@/components/shared/FloatingActions'
import { useNews } from '@/lib/temple.hooks'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

export const Route = createFileRoute('/news')({
  component: NewsPage,
})

function NewsPage() {
  const { data: news } = useNews()

  return (
    <div className="min-h-screen bg-background font-hindi">
      <Header />
      <main className="py-16 container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-12 text-center">महत्वपूर्ण विशेष सूचना</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news?.map((item) => (
            <Card key={item.id} className="overflow-hidden border-primary/10">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={item.featured_image_url || ""} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                  <Calendar className="h-4 w-4" />
                  <span className="font-inter">{new Date(item.publish_date || "").toLocaleDateString('hi-IN')}</span>
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{item.title}</h3>
                <p className="text-foreground/70 text-sm">{item.short_description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
      <DonationModal />
      <FloatingActions />
    </div>
  )
}
