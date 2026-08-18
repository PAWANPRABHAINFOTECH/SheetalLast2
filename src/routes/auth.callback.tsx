import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export const Route = createFileRoute('/auth/callback')({
  ssr: false,
  component: AuthCallbackPage,
})

function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuth = async () => {
      // Small delay to ensure hash is processed by Supabase client
      await new Promise((resolve) => setTimeout(resolve, 800))

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        console.error('Auth error:', error)
        toast.error('प्रमाणीकरण विफल: ' + error.message)
        void navigate({ to: '/admin/login', replace: true })
        return
      }

      // Check URL for recovery or signup confirmation
      // We look in both hash (legacy) and searchParams (PKCE)
      const hash = window.location.hash || ''
      const searchParams = new URLSearchParams(window.location.search)
      const isRecovery = hash.includes('type=recovery') || searchParams.get('type') === 'recovery'
      const isSignup = hash.includes('type=signup') || searchParams.get('type') === 'signup'

      console.log('Auth Callback State:', {
        hasSession: !!session,
        isRecovery,
        isSignup,
        hash: hash.substring(0, 20) + '...',
      })

      if (session) {
        if (isRecovery) {
          toast.success('पासवर्ड रीसेट सत्र सक्रिय')
          void navigate({ to: '/admin/reset-password', replace: true })
        } else {
          // Default to dashboard for successful login/signup
          void navigate({ to: '/admin/dashboard', replace: true })
        }
      } else {
        // PKCE Flow handling
        const code = searchParams.get('code')
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          if (exchangeError) {
            toast.error('कोड एक्सचेंज विफल: ' + exchangeError.message)
            void navigate({ to: '/admin/login', replace: true })
          } else {
            // Re-run the handleAuth to pick up the new session
            handleAuth()
          }
          return
        }

        // Final fallback
        toast.error('सत्र नहीं मिला। कृपया पुनः लॉगिन करें।')
        void navigate({ to: '/admin/login', replace: true })
      }
    }

    handleAuth()
  }, [navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-4 font-hindi">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-lg">प्रमाणीकरण किया जा रहा है, कृपया प्रतीक्षा करें...</p>
    </div>
  )
}
