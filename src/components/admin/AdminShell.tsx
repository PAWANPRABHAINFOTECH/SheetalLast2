import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { LogOut, Menu } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logoAsset from "@/assets/logo.png.asset.json";
import { AdminDashboard } from "./AdminDashboard";
import { EnquiriesSection } from "./EnquiriesSection";
import { SiteSettingsSection } from "./SiteSettingsSection";
import { CrudSection } from "./CrudSection";
import { YoutubeAdminSettings } from "./YoutubeAdminSettings";
import type { AdminField } from "./fieldTypes";

const GALLERY_CATEGORIES = [
  "मंदिर",
  "धार्मिक आयोजन",
  "पूजा",
  "बैठक",
  "सामाजिक गतिविधियाँ",
  "अन्य",
];
const MEMBER_CATEGORIES = ["संरक्षक", "संस्थापक सदस्य", "पदाधिकारी", "स्थाई कार्यकारिणी", "कार्यकारी सदस्य", "सदस्य"];

interface CrudConfig {
  kind: "crud";
  table: string;
  primaryField: string;
  imageField?: string;
  orderBy?: { column: string; ascending?: boolean };
  fields: AdminField[];
}

type SectionConfig =
  | { id: string; label: string; kind: "dashboard" | "enquiries" | "settings" }
  | ({ id: string; label: string } & CrudConfig);

const SECTIONS: SectionConfig[] = [
  { id: "dashboard", label: "डैशबोर्ड", kind: "dashboard" },
  {
    id: "youtube_sync",
    label: "यूट्यूब चैनल (सिंक)",
    kind: "dashboard", // Temporary kind to satisfy type, we will handle it in the render logic
  },
  {
    id: "youtube_special",
    label: "विशेष वीडियो",
    kind: "crud",
    table: "youtube_videos",
    primaryField: "title",
    imageField: "thumbnail",
    orderBy: { column: "display_order" },
    fields: [
      { name: "url", label: "यूट्यूब वीडियो लिंक", type: "text", placeholder: "उदा: https://www.youtube.com/watch?v=..." },
      { name: "youtube_id", label: "Video ID (लिंक से स्वतः)", type: "text" },
      { name: "thumbnail", label: "थंबनेल URL (लिंक से स्वतः)", type: "text" },
      { name: "title", label: "शीर्षक", type: "text" },
      { name: "description", label: "संक्षिप्त विवरण", type: "textarea" },
      { name: "display_order", label: "क्रम", type: "number" },
      { name: "source_type", label: "प्रकार", type: "text", placeholder: "special", defaultValue: "special" },
      { name: "is_active", label: "सक्रिय", type: "boolean" },
    ],
  },
  {
    id: "hero_slides",
    label: "होम स्लाइडर",
    kind: "crud",
    table: "hero_slides",
    primaryField: "title",
    imageField: "image_url",
    orderBy: { column: "display_order" },
    fields: [
      { name: "image_url", label: "छवि", type: "image", folder: "hero" },
      { name: "title", label: "शीर्षक", type: "text", placeholder: "उदा: भव्य महाकाल मंदिर" },
      { name: "subtitle", label: "उपशीर्षक", type: "text", placeholder: "उदा: आस्था और विश्वास का संगम" },
      { name: "button_text", label: "बटन टेक्स्ट", type: "text", placeholder: "उदा: अधिक जानें" },
      { name: "button_url", label: "बटन लिंक", type: "text", placeholder: "उदा: /about" },
      { name: "display_order", label: "क्रम (1, 2, 3...)", type: "number" },
      { name: "is_active", label: "सक्रिय", type: "boolean" },
    ],
  },
  {
    id: "notices",
    label: "सूचनाएँ",
    kind: "crud",
    table: "notices",
    primaryField: "content",
    orderBy: { column: "sort_order", ascending: true },
    fields: [
      { name: "sort_order", label: "क्रमांक", type: "number", placeholder: "उदा: 1, 2, 3..." },
      { name: "content", label: "सूचना", type: "textarea" },
      { name: "link_url", label: "लिंक", type: "text" },
      { name: "link_text", label: "लिंक टेक्स्ट", type: "text" },
      { name: "start_date", label: "प्रारंभ तिथि", type: "date" },
      { name: "end_date", label: "अंतिम तिथि", type: "date" },
      { name: "is_active", label: "सक्रिय", type: "boolean" },
    ],
  },
  {
    id: "news",
    label: "विशेष सूचना",
    kind: "crud",
    table: "news",
    primaryField: "title",
    imageField: "featured_image_url",
    orderBy: { column: "publish_date", ascending: false },
    fields: [
      { name: "title", label: "शीर्षक", type: "text" },
      { name: "short_description", label: "संक्षिप्त विवरण", type: "textarea" },
      { name: "full_description", label: "पूरा विवरण", type: "textarea" },
      { name: "featured_image_url", label: "छवि", type: "image", folder: "news" },
      { name: "publish_date", label: "प्रकाशन तिथि", type: "date" },
      { name: "is_active", label: "सक्रिय", type: "boolean" },
    ],
  },
  {
    id: "gallery",
    label: "गैलरी",
    kind: "crud",
    table: "gallery",
    primaryField: "title",
    imageField: "image_url",
    orderBy: { column: "created_at", ascending: false },
    fields: [
      { name: "image_url", label: "छवि", type: "image", folder: "gallery" },
      { name: "title", label: "शीर्षक", type: "text" },
      { name: "description", label: "विवरण", type: "textarea" },
      { name: "category", label: "श्रेणी", type: "select", options: GALLERY_CATEGORIES },
      { name: "event_date", label: "आयोजन तिथि", type: "date" },
      { name: "is_active", label: "सक्रिय", type: "boolean" },
    ],
  },
  {
    id: "members",
    label: "सदस्य",
    kind: "crud",
    table: "members",
    primaryField: "name",
    imageField: "photo_url",
    orderBy: { column: "display_order" },
    fields: [
      { name: "name", label: "नाम", type: "text" },
      { name: "designation", label: "पद", type: "text" },
      { name: "mobile_number", label: "मोबाइल नंबर", type: "text" },
      { name: "photo_url", label: "फ़ोटो", type: "image", folder: "members" },
      { name: "show_mobile_number", label: "मोबाइल नंबर दिखाएँ", type: "boolean" },
      { name: "category", label: "श्रेणी", type: "select", options: MEMBER_CATEGORIES },
      { name: "display_order", label: "क्रम", type: "number" },
      { name: "show_on_home", label: "होम पेज पर दिखाएँ", type: "boolean" },
      { name: "is_active", label: "सक्रिय", type: "boolean" },
    ],
  },
  {
    id: "live_darshan",
    label: "लाइव दर्शन",
    kind: "crud",
    table: "live_darshan",
    primaryField: "mode",
    orderBy: { column: "created_at", ascending: false },
    fields: [
      { name: "mode", label: "प्रकार", type: "select", options: ["youtube", "video"] },
      { name: "youtube_url", label: "YouTube लिंक", type: "text" },
      { name: "video_url", label: "वीडियो (अधिकतम 30 सेकंड)", type: "video", folder: "darshan", maxDuration: 30 },
      { name: "is_active", label: "सक्रिय", type: "boolean" },
    ],
  },
  {
    id: "chairman_messages",
    label: "अध्यक्ष संदेश",
    kind: "crud",
    table: "chairman_messages",
    primaryField: "name",
    imageField: "photo_url",
    orderBy: { column: "created_at", ascending: false },
    fields: [
      { name: "name", label: "नाम", type: "text" },
      { name: "designation", label: "पद", type: "text" },
      { name: "photo_url", label: "फ़ोटो", type: "image", folder: "chairman" },
      { name: "message", label: "संदेश", type: "textarea" },
      { name: "is_active", label: "सक्रिय", type: "boolean" },
    ],
  },
  {
    id: "temple_timings",
    label: "दर्शन / आरती समय",
    kind: "crud",
    table: "temple_timings",
    primaryField: "title",
    orderBy: { column: "display_order" },
    fields: [
      { name: "title", label: "शीर्षक", type: "text" },
      { name: "timing", label: "समय", type: "text" },
      { name: "display_order", label: "क्रम", type: "number" },
    ],
  },
  {
    id: "temple_info",
    label: "मंदिर जानकारी",
    kind: "crud",
    table: "temple_info",
    primaryField: "section_name",
    fields: [
      { name: "section_name", label: "अनुभाग", type: "text" },
      { name: "content", label: "सामग्री", type: "textarea" },
    ],
  },
  {
    id: "policies",
    label: "नीतियाँ",
    kind: "crud",
    table: "policies",
    primaryField: "policy_type",
    fields: [
      { name: "policy_type", label: "नीति प्रकार", type: "text" },
      { name: "content", label: "सामग्री", type: "textarea" },
      { name: "last_revised", label: "अंतिम संशोधन", type: "date" },
    ],
  },
  {
    id: "testimonials",
    label: "भक्तों के अनुभव (Testimonials)",
    kind: "crud",
    table: "testimonials",
    primaryField: "name",
    imageField: "photo_url",
    orderBy: { column: "created_at", ascending: false },
    fields: [
      { name: "name", label: "भक्त का नाम", type: "text" },
      { name: "content", label: "अनुभव / संदेश", type: "textarea" },
      { name: "photo_url", label: "फ़ोटो (Optional)", type: "image", folder: "testimonials" },
      { name: "is_active", label: "सक्रिय (Frontend पर दिखाएँ)", type: "boolean" },
    ],
  },
  {
    id: "comments",
    label: "प्रतिक्रियाएँ (Comments)",
    kind: "crud",
    table: "comments",
    primaryField: "name",
    orderBy: { column: "created_at", ascending: false },
    fields: [
      { name: "name", label: "नाम", type: "text" },
      { name: "mobile_number", label: "मोबाइल नंबर", type: "text" },
      { name: "content", label: "टिप्पणी / प्रतिक्रिया", type: "textarea" },
      { name: "status", label: "स्थिति", type: "select", options: ["pending", "approved", "rejected"] },
    ],
  },
  { id: "enquiries", label: "संपर्क पूछताछ", kind: "enquiries" },
  {
    id: "advertisements",
    label: "पोस्टर",
    kind: "crud",
    table: "advertisements",
    primaryField: "title",
    imageField: "image_url",
    orderBy: { column: "display_order" },
    fields: [
      { name: "title", label: "शीर्षक", type: "text" },
      { name: "description", label: "विवरण", type: "textarea" },
      { name: "image_url", label: "छवि", type: "image", folder: "events" },
      { name: "button_text", label: "बटन टेक्स्ट", type: "text" },
      { name: "button_url", label: "लिंक", type: "text" },
      { name: "display_order", label: "क्रम", type: "number" },
      { name: "is_active", label: "सक्रिय", type: "boolean" },
    ],
  },
  { id: "settings", label: "साइट सेटिंग्स", kind: "settings" },
];

export function AdminShell({ email }: { email: string }) {
  const [activeId, setActiveId] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const active = SECTIONS.find((section) => section.id === activeId) ?? SECTIONS[0]!;

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/admin/login", replace: true });
  };

  const nav = (
    <nav className="space-y-1">
      {SECTIONS.map((section) => (
        <button
          key={section.id}
          onClick={() => {
            setActiveId(section.id);
            setMobileOpen(false);
          }}
          className={`w-full rounded-xl px-4 py-2.5 text-right text-sm font-semibold transition-colors ${
            activeId === section.id
              ? "bg-primary text-primary-foreground"
              : "hover:bg-primary/10 text-foreground"
          }`}
        >
          {section.label}
        </button>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-muted/30 font-hindi">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b bg-card px-4 py-3 shadow-sm">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 overflow-y-auto p-6">
            {nav}
          </SheetContent>
        </Sheet>
        <img src={logoAsset.url} alt="लोगो" className="h-10 w-10" />
        <div className="min-w-0">
          <p className="truncate font-bold text-primary">शीतल शिवालय समिति</p>
          <p className="truncate text-xs text-muted-foreground">{email}</p>
        </div>
        <Button variant="outline" size="sm" className="ml-auto gap-2" onClick={() => void signOut()}>
          <LogOut className="h-4 w-4" /> लॉगआउट
        </Button>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 p-4 lg:p-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 rounded-2xl border border-primary/10 bg-card p-4 shadow-sm">
            {nav}
          </div>
        </aside>
        <main className="min-w-0 flex-1 rounded-2xl border border-primary/10 bg-card p-5 shadow-sm lg:p-8">
          {active.id === "dashboard" && <AdminDashboard />}
          {active.id === "youtube_sync" && (
            <div className="space-y-8">
              <YoutubeAdminSettings />
              {/* Removed redundant CrudSection for synced videos as requested */}
            </div>
          )}
          {active.id === "youtube_special" && active.kind === "crud" && (
            <CrudSection
              key={active.id}
              table={active.table}
              title={active.label}
              fields={active.fields.filter(f => f.name !== 'source_type')}
              primaryField={active.primaryField}
              {...(active.imageField ? { imageField: active.imageField } : {})}
              {...(active.orderBy ? { orderBy: active.orderBy } : {})}
              filter={{ source_type: "special" }}
              defaultValues={{ source_type: "special" }}
            />
          )}
          {active.kind === "enquiries" && <EnquiriesSection />}
          {active.kind === "settings" && <SiteSettingsSection />}
          {active.kind === "crud" && active.id !== "youtube_sync" && active.id !== "youtube_special" && (
            <CrudSection
              key={active.id}
              table={active.table}
              title={active.label}
              fields={active.fields}
              primaryField={active.primaryField}
              {...(active.imageField ? { imageField: active.imageField } : {})}
              {...(active.orderBy ? { orderBy: active.orderBy } : {})}
            />
          )}
        </main>
      </div>
      <footer className="mt-auto border-t py-6 flex flex-col items-center gap-3">
        <img src="/pawanprabha_logo.jpg" alt="PAWANPRABHA INFOTECH" className="h-12 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" />
        <div className="flex flex-col items-center gap-2">
          <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">
            DESIGNED & DEVELOPED BY PAWANPRABHA INFOTECH
          </p>
          <a 
            href="https://wa.me/916262013335?text=नमस्कार, शीतल शिवालय समिति"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>6262013335</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
