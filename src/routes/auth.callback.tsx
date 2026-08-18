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
      console.log('Auth Callback triggered, URL:', window.location.href);
      
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');
      const error = url.searchParams.get('error');
      const errorDescription = url.searchParams.get('error_description');

      if (error) {
        console.error('Auth Callback: Error from URL:', error, errorDescription);
        toast.error(`प्रमाणीकरण त्रुटि: ${errorDescription || error}`);
        void navigate({ to: '/admin/login', replace: true });
        return;
      }
      
      // Check both query params and hash for type=recovery
      const type = url.searchParams.get('type') || (url.hash.includes('type=recovery') ? 'recovery' : '');
      
      if (code) {
        console.log('Auth Callback: Exchanging PKCE code...');
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          console.error('PKCE exchange error:', exchangeError);
          // Only show error if it's NOT a recovery flow, or if the error is severe.
          // Sometimes for recovery flows across devices, PKCE exchange might fail but session might still be active.
          if (type !== 'recovery') {
            toast.error('प्रमाणीकरण विफल: ' + exchangeError.message);
            void navigate({ to: '/admin/login', replace: true });
            return;
          }
        }
      }

      // Small delay to ensure the Supabase client has time to process the session from URL hash if any
      await new Promise((resolve) => setTimeout(resolve, 800));

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('Auth Callback: Session error:', sessionError);
        toast.error('सत्र प्राप्त करने में त्रुटि: ' + sessionError.message);
        void navigate({ to: '/admin/login', replace: true });
        return;
      }

      console.log('Auth Callback: Final state:', { hasSession: !!session, type });

      if (session) {
        if (type === 'recovery') {
          toast.success('पासवर्ड रीसेट के लिए तैयार');
          void navigate({ to: '/admin/reset-password', replace: true });
        } else {
          toast.success('लॉगिन सफल');
          void navigate({ to: '/admin/dashboard', replace: true });
        }
      } else {
        console.warn('Auth Callback: No session found after processing');
        toast.error('सत्र नहीं मिला। कृपया ईमेल लिंक का पुनः उपयोग करें।');
        void navigate({ to: '/admin/login', replace: true });
      }
    };

    handleAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-4 font-hindi">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-lg">प्रमाणीकरण किया जा रहा है, कृपया प्रतीक्षा करें...</p>
    </div>
  )
}
