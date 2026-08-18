import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/reset-password')({
  ssr: false,
  head: () => ({
    meta: [
      { title: 'पासवर्ड बदलें | शीतल शिवालय समिति' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if we have a session (meaning the user clicked the reset link)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      // We are in reset-password, we MUST have a session (handled by auth callback)
      if (!session) {
        toast.error('पासवर्ड बदलने के लिए लॉगिन आवश्यक है। कृपया लिंक का पुनः उपयोग करें।')
        void navigate({ to: '/admin/login', replace: true })
      }
    }
    checkSession()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password: password
    })

    setLoading(false)

    if (error) {
      toast.error('त्रुटि: ' + error.message)
    } else {
      setSuccess(true)
      toast.success('पासवर्ड सफलतापूर्वक बदल दिया गया है')
      setTimeout(() => {
        void navigate({ to: '/admin/login', replace: true })
      }, 3000)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4 font-hindi">
        <Card className="w-full max-w-md text-center p-8 space-y-4">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
          <CardTitle className="text-2xl">सफलता!</CardTitle>
          <p>आपका पासवर्ड अपडेट हो गया है। आपको लॉगिन पेज पर भेजा जा रहा है...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4 font-hindi">
      <Card className="w-full max-w-md border-none shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground text-center py-10">
          <CardTitle className="font-hindi text-2xl">नया पासवर्ड सेट करें</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="font-bold">नया पासवर्ड</label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="कम से कम 6 अक्षर"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full py-6 text-lg bg-primary">
              {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              पासवर्ड अपडेट करें
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
