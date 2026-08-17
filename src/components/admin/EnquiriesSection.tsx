import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function EnquiriesSection() {
  const queryClient = useQueryClient();
  const queryKey = ["admin", "contact_enquiries"];

  const { data: rows = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_enquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const update = useMutation({
    mutationFn: async ({
      id,
      patch,
    }: {
      id: string;
      patch: { is_read?: boolean; is_replied?: boolean };
    }) => {
      const { error } = await supabase.from("contact_enquiries").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey }),
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_enquiries").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("हटा दिया गया");
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">संपर्क पूछताछ</h2>
      {rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
          अभी कोई पूछताछ नहीं है।
        </p>
      ) : (
        <div className="grid gap-3">
          {rows.map((row) => (
            <div key={row.id} className="rounded-2xl border border-primary/10 bg-card p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-semibold">{row.full_name}</p>
                <span className="text-sm text-muted-foreground">{row.mobile}</span>
                {row.email && <span className="text-sm text-muted-foreground">{row.email}</span>}
                {!row.is_read && <Badge variant="secondary">नया</Badge>}
                {row.is_replied && <Badge>उत्तर दिया</Badge>}
                <span className="ml-auto text-xs text-muted-foreground">
                  {row.created_at ? new Date(row.created_at).toLocaleString("hi-IN") : ""}
                </span>
              </div>
              {row.message && <p className="mt-3 whitespace-pre-wrap text-sm">{row.message}</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                {!row.is_read && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => update.mutate({ id: row.id, patch: { is_read: true } })}
                  >
                    पढ़ा हुआ चिह्नित करें
                  </Button>
                )}
                {!row.is_replied && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    onClick={() =>
                      update.mutate({ id: row.id, patch: { is_replied: true, is_read: true } })
                    }
                  >
                    <Check className="h-4 w-4" /> उत्तर दिया
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-2 text-destructive"
                  onClick={() => {
                    if (confirm("क्या आप वाकई हटाना चाहते हैं?")) remove.mutate(row.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" /> हटाएँ
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
