import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const claimFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { userId } = context;

    // Call the private RPC function using the admin client
    const { data, error } = await supabaseAdmin.rpc('claim_first_admin' as any, {
      _user_id: userId
    });

    if (error) {
      console.error("Error claiming first admin:", error);
      throw new Error(error.message);
    }

    return data as boolean;
  });
