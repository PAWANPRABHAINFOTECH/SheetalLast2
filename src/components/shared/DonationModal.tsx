import { useSiteSettings } from "@/lib/temple.hooks";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/logo.png.asset.json";
import { useState, useEffect } from "react";
import { Copy, Check, QrCode, Building2 } from "lucide-react";

// Hook-like event listener for opening the modal from anywhere
export function useDonationModal() {
  const openModal = () => {
    window.dispatchEvent(new CustomEvent("open-donation-modal"));
  };
  return { openModal };
}

export function DonationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'qr' | 'bank'>('qr');
  const [copied, setCopied] = useState(false);
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-donation-modal", handleOpen);
    return () => window.removeEventListener("open-donation-modal", handleOpen);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl sm:max-h-[90vh] overflow-y-auto rounded-3xl p-0 border-none">
        <div className="bg-primary text-primary-foreground p-8 text-center relative overflow-hidden">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          
          <img src={logoAsset.url} alt="Logo" className="h-20 w-20 mx-auto mb-4 bg-white rounded-full p-2 relative z-10" />
          <DialogTitle className="font-hindi text-3xl font-bold mb-2 relative z-10">शीतल शिवालय समिति</DialogTitle>
          <p className="font-hindi text-sm text-primary-foreground/80 relative z-10">
            शीतल सिटी, मंडीदीप, जिला-रायसेन (मध्यप्रदेश) – 462046
          </p>
        </div>

        <div className="p-8 space-y-8">
          <div className="text-center space-y-4">
            <h3 className="font-hindi text-2xl font-bold text-primary underline decoration-secondary decoration-4 underline-offset-8">आपका योगदान</h3>
            <p className="font-hindi text-foreground/80 leading-relaxed italic">
              "आपके योगदान से प्रभु की पूजा, आयोजन और सामाजिक गतिविधियाँ पूरी होती हैं। आपका दान मंदिर के विकास और सेवाओं को बेहतर बनाने में मदद करता है।"
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant={activeTab === 'qr' ? 'default' : 'outline'} 
              className={`font-hindi rounded-2xl h-16 text-lg ${activeTab === 'qr' ? 'bg-primary' : 'border-primary text-primary'}`}
              onClick={() => setActiveTab('qr')}
            >
              <QrCode className="mr-2 h-6 w-6" />
              QR कोड
            </Button>
            <Button 
              variant={activeTab === 'bank' ? 'default' : 'outline'} 
              className={`font-hindi rounded-2xl h-16 text-lg ${activeTab === 'bank' ? 'bg-primary' : 'border-primary text-primary'}`}
              onClick={() => setActiveTab('bank')}
            >
              <Building2 className="mr-2 h-6 w-6" />
              बैंक विवरण
            </Button>
          </div>

          {activeTab === 'qr' ? (
            <div className="flex flex-col items-center gap-6 animate-in fade-in duration-500">
              <div className="bg-white p-6 rounded-3xl shadow-2xl border-4 border-secondary/20">
                <img 
                  src={settings?.donation_qr_url || "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=UPI_ID_HERE"} 
                  alt="Donation QR" 
                  className="w-48 h-48 md:w-64 md:h-64 object-contain"
                />
              </div>
              <div className="text-center">
                <p className="font-hindi text-lg font-bold text-primary mb-2">UPI / QR द्वारा दान करें</p>
                {settings?.upi_id && (
                  <Button 
                    variant="ghost" 
                    className="font-inter text-muted-foreground hover:text-primary gap-2"
                    onClick={() => copyToClipboard(settings.upi_id || "")}
                  >
                    {settings.upi_id}
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-500">
              <div className="bg-secondary/5 border-2 border-secondary/20 rounded-3xl p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-hindi text-xs text-muted-foreground uppercase tracking-widest">खाता धारक</label>
                    <p className="font-hindi text-lg font-bold text-primary">{settings?.bank_account_name || "शीतल शिवालय समिति"}</p>
                  </div>
                  <div>
                    <label className="font-hindi text-xs text-muted-foreground uppercase tracking-widest">बैंक का नाम</label>
                    <p className="font-hindi text-lg font-bold text-primary">{settings?.bank_name || "---"}</p>
                  </div>
                  <div>
                    <label className="font-hindi text-xs text-muted-foreground uppercase tracking-widest">खाता संख्या</label>
                    <div className="flex items-center justify-between">
                      <p className="font-inter text-lg font-bold text-primary tracking-wider">{settings?.bank_account_number || "---"}</p>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(settings?.bank_account_number || "")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="font-hindi text-xs text-muted-foreground uppercase tracking-widest">IFSC कोड</label>
                    <div className="flex items-center justify-between">
                      <p className="font-inter text-lg font-bold text-primary">{settings?.bank_ifsc || "---"}</p>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(settings?.bank_ifsc || "")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-muted/30 p-6 rounded-3xl text-center space-y-2">
            <p className="font-hindi text-sm font-bold text-primary">आपके योगदान का महत्व</p>
            <p className="font-hindi text-xs text-foreground/70 leading-relaxed">
              आपका दान भगवान के आशीर्वाद से समाज के उत्थान में सहायक होगा। हम आपके योगदान के लिए हमेशा आभारी रहेंगे।
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
