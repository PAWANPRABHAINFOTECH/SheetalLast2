import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import logoAsset from '@/assets/logo.png.asset.json'
import { supabase } from '@/integrations/supabase/client'
import { useAdminAuth } from '@/lib/admin/useAdminAuth'

export const Route = createFileRoute('/admin/login')({
  ssr: false,
  head: () => ({
    meta: [
      { title: 'एडमिन लॉगिन | शीतल शिवालय समिति' },
      { name: 'robots', content: 'noindex, nofollow' },
      { name: 'description', content: 'अधिकृत प्रशासक के लिए सुरक्षित लॉगिन।' },
    ],
  }),
  component: AdminLoginPage,
})

function AdminLoginPage() {
  const { session, loading } = useAdminAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (session) {
    void navigate({ to: '/admin/dashboard', replace: true })
    return null
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setSubmitting(false)
    if (error) {
      toast.error('लॉगिन विफल: ईमेल या पासवर्ड गलत है')
      return
    }
    toast.success('स्वागत है')
    void navigate({ to: '/admin/dashboard', replace: true })
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4 font-hindi">
      <Card className="w-full max-w-md border-none shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground text-center py-10">
          <img
            src={logoAsset.url}
            alt="शीतल शिवालय समिति"
            className="h-20 w-20 mx-auto mb-4 bg-white rounded-full p-2"
          />
          <CardTitle className="font-hindi text-2xl">एडमिन लॉगिन</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="font-bold">ईमेल</label>
              <Input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="font-bold">पासवर्ड</label>
              <Input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={submitting} className="w-full py-6 text-lg bg-primary">
              {submitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              लॉगिन करें
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              केवल अधिकृत प्रशासक ही लॉगिन कर सकते हैं।
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
