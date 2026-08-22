import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { MediaInput } from "./MediaInput";

type Settings = Record<string, unknown>;

const TEXT_FIELDS: { name: string; label: string; long?: boolean }[] = [
  { name: "site_name", label: "साइट का नाम" },
  { name: "devotee_count", label: "भक्त जुड़ाव" },
  { name: "address", label: "पता", long: true },
  { name: "registration_no", label: "पंजीयन क्रमांक" },
  { name: "phone", label: "फ़ोन नंबर" },
  { name: "whatsapp", label: "व्हाट्सएप नंबर" },
  { name: "whatsapp_auto_message", label: "WhatsApp Auto Message", long: true },
  { name: "email", label: "ईमेल" },
  { name: "upi_id", label: "UPI आईडी" },
  { name: "bank_account_name", label: "खाता धारक का नाम" },
  { name: "bank_name", label: "बैंक का नाम" },
  { name: "bank_account_number", label: "खाता क्रमांक" },
  { name: "bank_ifsc", label: "IFSC कोड" },
  { name: "bank_branch", label: "शाखा" },
  { name: "youtube_url", label: "YouTube लिंक" },
  { name: "instagram_url", label: "Instagram लिंक" },
  { name: "facebook_url", label: "Facebook लिंक" },
  { name: "google_maps_embed_url", label: "Google Maps एम्बेड URL", long: true },
  { name: "latitude", label: "अक्षांश" },
  { name: "longitude", label: "देशांतर" },
];

const TOGGLES = [
  { name: "youtube_enabled", label: "YouTube दिखाएँ" },
  { name: "instagram_enabled", label: "Instagram दिखाएँ" },
  { name: "facebook_enabled", label: "Facebook दिखाएँ" },
];

const MEDIA = [
  { name: "logo_url", label: "लोगो" },
  { name: "donation_qr_url", label: "दान QR कोड" },
];

export function SiteSettingsSection() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<Settings>({});

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (data) setForm(data as Settings);
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const payload: Settings = {};
      for (const key of [
        ...TEXT_FIELDS.map((f) => f.name),
        ...TOGGLES.map((f) => f.name),
        ...MEDIA.map((f) => f.name),
      ]) {
        payload[key] = form[key] ?? null;
      }
      const client = supabase as unknown as { from: (t: string) => any };
      if (form['id']) {
        const { error } = await client.from("site_settings").update(payload).eq("id", form['id']);
        if (error) throw error;
      } else {
        const { error } = await client.from("site_settings").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("सेटिंग्स सहेज ली गईं");
      void queryClient.invalidateQueries({ queryKey: ["admin", "site_settings"] });
      void queryClient.invalidateQueries({ queryKey: ["site-settings"] });
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

  const set = (name: string, value: unknown) => setForm((prev) => ({ ...prev, [name]: value }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">साइट सेटिंग्स एवं दान विवरण</h2>
      <div className="grid gap-5 md:grid-cols-2">
        {TEXT_FIELDS.map((field) => (
          <div key={field.name} className={field.long ? "space-y-2 md:col-span-2" : "space-y-2"}>
            <label className="text-sm font-semibold">{field.label}</label>
            {field.long ? (
              <Textarea
                value={String(form[field.name] ?? "")}
                onChange={(e) => set(field.name, e.target.value)}
              />
            ) : (
              <Input
                value={String(form[field.name] ?? "")}
                onChange={(e) => set(field.name, e.target.value)}
              />
            )}
          </div>
        ))}
        {MEDIA.map((field) => (
          <div key={field.name} className="space-y-2">
            <label className="text-sm font-semibold">{field.label}</label>
            <MediaInput
              kind="image"
              folder="settings"
              value={String(form[field.name] ?? "")}
              onChange={(url) => set(field.name, url)}
            />
          </div>
        ))}
        {TOGGLES.map((field) => (
          <div key={field.name} className="flex items-center gap-3">
            <Switch
              checked={Boolean(form[field.name])}
              onCheckedChange={(checked) => set(field.name, checked)}
            />
            <span className="text-sm font-semibold">{field.label}</span>
          </div>
        ))}
      </div>
      <Button onClick={() => save.mutate()} disabled={save.isPending} className="gap-2">
        {save.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        सहेजें
      </Button>
    </div>
  );
}
