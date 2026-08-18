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
      // The session should be handled automatically by Supabase client 
      // when it sees the access_token in the URL hash.
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        toast.error('प्रमाणीकरण विफल: ' + error.message)
        void navigate({ to: '/admin/login', replace: true })
        return
      }

      if (session) {
        // If it's a recovery flow (password reset), redirect to reset-password
        const isRecovery = window.location.hash.includes('type=recovery')
        if (isRecovery) {
          void navigate({ to: '/admin/reset-password', replace: true })
        } else {
          // Default to dashboard for other successful auths (like signup verification)
          void navigate({ to: '/admin/dashboard', replace: true })
        }
      } else {
        // Fallback if no session found immediately
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
