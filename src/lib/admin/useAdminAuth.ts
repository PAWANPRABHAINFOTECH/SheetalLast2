import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useAdminAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const resolveRole = async (s: Session | null) => {
      if (!s) {
        if (active) {
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }
      
      try {
        const { data, error } = await supabase.rpc("has_role", {
          _user_id: s.user.id,
          _role: "admin",
        });

        if (error) {
          console.error("Error checking admin role:", error);
          if (active) {
            setIsAdmin(false);
            setLoading(false);
          }
          return;
        }

        if (active) {
          setIsAdmin(Boolean(data));
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to resolve role:", err);
        if (active) {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    };

    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      console.log("Auth State Change:", event, s?.user?.email);
      if (active) {
        setSession(s);
        // Don't set loading true if we already have a session, 
        // just update role if needed
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          setLoading(true);
          void resolveRole(s);
        } else if (event === 'SIGNED_OUT') {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    });

    void supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setSession(data.session);
        void resolveRole(data.session);
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, isAdmin, loading };
}
