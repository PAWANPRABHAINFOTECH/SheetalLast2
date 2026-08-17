import { useQuery } from "@tanstack/react-query";
import { Newspaper, Images, Users, MessageSquare, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

const CARDS = [
  { table: "news", label: "समाचार", icon: Newspaper },
  { table: "gallery", label: "गैलरी छवियाँ", icon: Images },
  { table: "members", label: "सदस्य", icon: Users },
  { table: "notices", label: "सूचनाएँ", icon: Bell },
  { table: "contact_enquiries", label: "संपर्क पूछताछ", icon: MessageSquare },
] as const;

export function AdminDashboard() {
  const { data: counts } = useQuery({
    queryKey: ["admin", "counts"],
    queryFn: async () => {
      const entries = await Promise.all(
        CARDS.map(async (card) => {
          const { count } = await (supabase as unknown as { from: (t: string) => any })
            .from(card.table)
            .select("id", { count: "exact", head: true });
          return [card.table, count ?? 0] as const;
        }),
      );
      return Object.fromEntries(entries) as Record<string, number>;
    },
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">डैशबोर्ड</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {CARDS.map(({ table, label, icon: Icon }) => (
          <Card key={table} className="border-primary/10 shadow-sm">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-2xl bg-primary/10 p-3">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold">{counts?.[table] ?? 0}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
