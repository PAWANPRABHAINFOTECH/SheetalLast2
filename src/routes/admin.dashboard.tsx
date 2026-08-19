import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { supabase } from '@/integrations/supabase/client'
import { useAdminAuth } from '@/lib/admin/useAdminAuth'
import { AdminShell } from '@/components/admin/AdminShell'

export const Route = createFileRoute('/admin/dashboard')({
  ssr: false,
  head: () => ({
    meta: [
      { title: 'एडमिन डैशबोर्ड | शीतल शिवालय समिति' },
      { name: 'robots', content: 'noindex, nofollow' },
      { name: 'description', content: 'शीतल शिवालय समिति वेबसाइट प्रबंधन डैशबोर्ड।' },
    ],
  }),
  component: AdminDashboardPage,
})

function AdminDashboardPage() {
  const { session, isAdmin, loading } = useAdminAuth()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!session) {
    void navigate({ to: '/admin/login', replace: true })
    return null
  }

  if (!isAdmin) return <NoAccess />

  return <AdminShell email={session.user.email ?? ''} />
}

function NoAccess() {
  const [claiming, setClaiming] = useState(false)

  const claim = async () => {
    setClaiming(true)
    const { data, error } = await supabase.rpc('claim_first_admin' as any) // Moved to private schema or renamed
    setClaiming(false)
    if (error) {
      toast.error(error.message)
      return
    }
    if (data) {
      toast.success('आप एडमिन बन गए हैं')
      window.location.reload()
    } else {
      toast.error('एडमिन पहले से मौजूद है — कृपया अधिकृत खाते से लॉगिन करें')
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-muted/30 p-6 font-hindi text-center">
      <p className="text-lg font-semibold text-destructive">
        आपके खाते को एडमिन अनुमति प्राप्त नहीं है।
      </p>
      <p className="max-w-md text-sm text-muted-foreground">
        यदि यह वेबसाइट का पहला सेटअप है, तो नीचे क्लिक करके स्वयं को एडमिन बनाएँ। एक बार एडमिन बनने के
        बाद यह विकल्प बंद हो जाएगा।
      </p>
      <Button onClick={() => void claim()} disabled={claiming} className="gap-2">
        {claiming && <Loader2 className="h-4 w-4 animate-spin" />}
        पहला एडमिन बनें
      </Button>
      <Button variant="outline" onClick={() => void supabase.auth.signOut()}>
        लॉगआउट
      </Button>
    </div>
  )
}
