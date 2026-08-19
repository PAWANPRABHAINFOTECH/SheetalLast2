import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { DonationModal } from '@/components/shared/DonationModal'
import { FloatingActions } from '@/components/shared/FloatingActions'
import { useMembers } from '@/lib/temple.hooks'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

export const Route = createFileRoute('/members')({
  component: MembersPage,
})

function MembersPage() {
  const { data: members } = useMembers()
  
  const categories = ["संरक्षक", "पदाधिकारी", "स्थाई कार्यकारिणी", "कार्यकारी सदस्य"];

  return (
    <div className="min-h-screen bg-background font-hindi">
      <Header />
      <main className="py-16 container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-12 text-center">सदस्य एवं पदाधिकारी</h1>
        
        {categories.map(cat => {
          const catMembers = members?.filter(m => m.category === cat) || [];
          if (catMembers.length === 0) return null;
          
          return (
            <div key={cat} className="mb-16">
              <h2 className="text-3xl font-bold text-primary mb-8 border-b-4 border-secondary inline-block pb-2">{cat}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {catMembers.map(member => (
                  <Card key={member.id} className="text-center p-4 border-primary/5">
                    <CardContent className="p-0">
                      <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-white shadow">
                        <AvatarImage src={member.photo_url || ""} className="object-cover" />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-bold text-primary text-sm">{member.name}</h3>
                      <p className="text-secondary text-xs mb-2">{member.designation}</p>
                      {member.mobile_number && member.show_mobile_number && (
                        <a 
                          href={`tel:${member.mobile_number}`}
                          className="block text-[10px] text-primary hover:text-secondary transition-colors mb-2 flex items-center justify-center gap-1"
                        >
                          <span>📱</span> {member.mobile_number}
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </main>
      <Footer />
      <DonationModal />
      <FloatingActions />
    </div>
  )
}
