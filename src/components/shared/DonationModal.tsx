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
import { Copy, Check, QrCode, Building2, MessageCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n";


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
  const { t } = useLanguage();


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
      <DialogContent className="max-w-2xl w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto rounded-3xl p-0 border-none bg-background scrollbar-hide">
        <div className="bg-primary text-primary-foreground p-8 text-center relative overflow-hidden">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          
          <img src={logoAsset.url} alt="Logo" className="h-16 w-16 md:h-20 md:w-20 mx-auto mb-4 bg-white dark:bg-primary/20 rounded-full p-2 relative z-10" />
          <DialogTitle className="font-hindi text-2xl md:text-3xl font-bold mb-2 relative z-10 leading-tight">शीतल शिवालय समिति</DialogTitle>
          <p className="font-hindi text-sm text-primary-foreground/80 relative z-10">
            शीतल सिटी, मंडीदीप, जिला-रायसेन (मध्यप्रदेश) – 462046
          </p>
        </div>

        <div className="p-8 space-y-8">
          <div className="text-center space-y-4">
            <h3 className="font-hindi text-2xl font-bold text-primary underline decoration-secondary decoration-4 underline-offset-8">{t('donation.title')}</h3>
            <p className="font-hindi text-foreground/80 leading-relaxed italic">
              {t('donation.msg')}
            </p>

          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant={activeTab === 'qr' ? 'default' : 'outline'} 
              className={`font-hindi rounded-2xl h-16 text-lg ${activeTab === 'qr' ? 'bg-primary' : 'border-primary text-primary'}`}
              onClick={() => setActiveTab('qr')}
            >
              <QrCode className="mr-2 h-6 w-6" />
              {t('donation.qrTab')}
            </Button>
            <Button 
              variant={activeTab === 'bank' ? 'default' : 'outline'} 
              className={`font-hindi rounded-2xl h-16 text-lg ${activeTab === 'bank' ? 'bg-primary' : 'border-primary text-primary'}`}
              onClick={() => setActiveTab('bank')}
            >
              <Building2 className="mr-2 h-6 w-6" />
              {t('donation.bankTab')}
            </Button>
          </div>

          {activeTab === 'qr' ? (
            <div className="flex flex-col items-center gap-6 animate-in fade-in duration-500">
              <div className="bg-white dark:bg-primary/5 p-6 rounded-3xl shadow-2xl border-4 border-secondary/20">
                <img 
                  src={settings?.donation_qr_url || "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=UPI_ID_HERE"} 
                  alt="Donation QR" 
                  className="w-48 h-48 md:w-64 md:h-64 object-contain"
                />
              </div>
              <div className="text-center">
                <p className="font-hindi text-lg font-bold text-primary mb-2">{t('donation.qrMethod')}</p>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 overflow-x-hidden">
                  <div>
                    <label className="font-hindi text-xs text-muted-foreground uppercase tracking-widest">{t('donation.holder')}</label>
                    <p className="font-hindi text-lg font-bold text-primary">{settings?.bank_account_name || "शीतल शिवालय समिति"}</p>
                  </div>
                  <div>
                    <label className="font-hindi text-xs text-muted-foreground uppercase tracking-widest">{t('donation.bankName')}</label>
                    <p className="font-hindi text-lg font-bold text-primary">{settings?.bank_name || "---"}</p>
                  </div>
                  <div>
                    <label className="font-hindi text-xs text-muted-foreground uppercase tracking-widest">{t('donation.accountNo')}</label>
                    <div className="flex items-center justify-between gap-2 overflow-hidden">
                      <p className="font-inter text-base md:text-lg font-bold text-primary tracking-wider truncate">{settings?.bank_account_number || "---"}</p>
                      <Button variant="ghost" size="sm" className="shrink-0" onClick={() => copyToClipboard(settings?.bank_account_number || "")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="font-hindi text-xs text-muted-foreground uppercase tracking-widest">{t('donation.ifsc')}</label>
                    <div className="flex items-center justify-between gap-2 overflow-hidden">
                      <p className="font-inter text-base md:text-lg font-bold text-primary truncate">{settings?.bank_ifsc || "---"}</p>
                      <Button variant="ghost" size="sm" className="shrink-0" onClick={() => copyToClipboard(settings?.bank_ifsc || "")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-muted/30 p-6 rounded-3xl text-center space-y-2">
            <p className="font-hindi text-sm font-bold text-primary">{t('donation.importance')}</p>
            <p className="font-hindi text-xs text-foreground/70 leading-relaxed">
              {t('donation.importanceMsg')}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-muted-foreground/10 text-center pb-8">
            <a 
              href="https://wa.me/916262013335?text=नमस्कार, शीतल शिवालय समिति" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex flex-col sm:flex-row items-center justify-center gap-2 hover:opacity-80 transition-opacity"
            >
              <span className="text-[10px] md:text-xs font-bold tracking-widest text-muted-foreground uppercase">
                DESIGNED & DEVELOPED BY PAWANPRABHA INFOTECH
              </span>
              <div className="flex items-center gap-1.5 bg-green-500/10 text-green-600 px-3 py-1 rounded-full border border-green-500/20">
                <MessageCircle className="h-3.5 w-3.5 fill-green-600/20" />
                <span className="text-xs font-bold font-inter tracking-wider">6262013335</span>
              </div>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
