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
      await new Promise(resolve => setTimeout(resolve, 500))

      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Auth error:', error)
        toast.error('प्रमाणीकरण विफल: ' + error.message)
        void navigate({ to: '/admin/login', replace: true })
        return
      }

      // Check URL for recovery or signup confirmation
      const hash = window.location.hash || ''
      const searchParams = new URLSearchParams(window.location.search)
      const isRecovery = hash.includes('type=recovery') || searchParams.get('type') === 'recovery'
      const isSignup = hash.includes('type=signup') || searchParams.get('type') === 'signup'

      if (session) {
        if (isRecovery) {
          void navigate({ to: '/admin/reset-password', replace: true })
        } else if (isSignup) {
          void navigate({ to: '/admin/dashboard', replace: true })
        } else {
          // Default fallback
          void navigate({ to: '/admin/dashboard', replace: true })
        }
      } else {
        // If no session, but we have a code in the URL, try to exchange it (PKCE)
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

        // Final fallback if no session and no code
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
