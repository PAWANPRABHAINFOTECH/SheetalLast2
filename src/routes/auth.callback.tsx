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
      
      // Small delay to ensure the Supabase client has time to catch the hash
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 1. Check for PKCE 'code' in search params
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get('code');
      
      if (code) {
        console.log('Auth Callback: Exchanging PKCE code...');
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          console.error('PKCE exchange error:', exchangeError);
          toast.error('प्रमाणीकरण विफल: ' + exchangeError.message);
          void navigate({ to: '/admin/login', replace: true });
          return;
        }
      }

      // 2. Get session (this handles both hash-based and code-based results)
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Auth Callback: Session error:', error);
        toast.error('प्रमाणीकरण विफल: ' + error.message);
        void navigate({ to: '/admin/login', replace: true });
        return;
      }

      // 3. Determine redirect path
      const hash = window.location.hash || '';
      const type = searchParams.get('type') || (hash.includes('type=recovery') ? 'recovery' : '');

      console.log('Auth Callback: Processed state:', { hasSession: !!session, type });

      if (session) {
        if (type === 'recovery') {
          toast.success('पासवर्ड रीसेट के लिए तैयार');
          void navigate({ to: '/admin/reset-password', replace: true });
        } else {
          toast.success('लॉगिन सफल');
          void navigate({ to: '/admin/dashboard', replace: true });
        }
      } else {
        // No session found - maybe the link was already used or expired
        console.warn('Auth Callback: No session found after exchange/hash processing');
        toast.error('सत्र नहीं मिला। कृपया पुनः प्रयास करें।');
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
