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
import type { AdminField } from "./fieldTypes";

const GALLERY_CATEGORIES = [
  "मंदिर",
  "धार्मिक आयोजन",
  "पूजा",
  "बैठक",
  "सामाजिक गतिविधियाँ",
  "अन्य",
];
const MEMBER_CATEGORIES = ["संरक्षक", "पदाधिकारी", "स्थाई कार्यकारिणी", "कार्यकारी सदस्य"];

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
    orderBy: { column: "created_at", ascending: false },
    fields: [
      { name: "content", label: "सूचना", type: "textarea" },
      { name: "link_url", label: "लिंक", type: "text" },
      { name: "link_text", label: "लिंक टेक्स्ट", type: "text" },
      { name: "priority", label: "प्राथमिकता", type: "select", options: ["low", "medium", "high"] },
      { name: "start_date", label: "प्रारंभ तिथि", type: "date" },
      { name: "end_date", label: "अंतिम तिथि", type: "date" },
      { name: "is_active", label: "सक्रिय", type: "boolean" },
    ],
  },
  {
    id: "news",
    label: "समाचार",
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
      { name: "photo_url", label: "फ़ोटो", type: "image", folder: "members" },
      { name: "category", label: "श्रेणी", type: "select", options: MEMBER_CATEGORIES },
      { name: "display_order", label: "क्रम", type: "number" },
      { name: "show_on_home", label: "होम पेज पर दिखाएँ", type: "boolean" },
      { name: "is_active", label: "सक्रिय", type: "boolean" },
    ],
  },
  {
    id: "advertisements",
    label: "विज्ञापन / कार्यक्रम",
    kind: "crud",
    table: "advertisements",
    primaryField: "title",
    imageField: "image_url",
    orderBy: { column: "display_order" },
    fields: [
      { name: "image_url", label: "छवि", type: "image", folder: "ads" },
      { name: "title", label: "शीर्षक", type: "text" },
      { name: "description", label: "विवरण", type: "textarea" },
      { name: "button_text", label: "बटन टेक्स्ट", type: "text" },
      { name: "button_url", label: "बटन लिंक", type: "text" },
      { name: "display_order", label: "क्रम", type: "number" },
      { name: "start_date", label: "प्रारंभ तिथि", type: "date" },
      { name: "end_date", label: "अंतिम तिथि", type: "date" },
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
  { id: "enquiries", label: "संपर्क पूछताछ", kind: "enquiries" },
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
          <p className="truncate font-bold text-primary">एडमिन पैनल</p>
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
          {active.kind === "dashboard" && <AdminDashboard />}
          {active.kind === "enquiries" && <EnquiriesSection />}
          {active.kind === "settings" && <SiteSettingsSection />}
          {active.kind === "crud" && (
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
    </div>
  );
}
