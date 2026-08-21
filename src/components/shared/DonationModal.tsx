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
      <DialogContent className="w-[95vw] max-w-2xl max-h-[92vh] flex flex-col overflow-hidden rounded-2xl p-0 border-none bg-background sm:w-full sm:rounded-3xl">
        <div className="bg-primary text-primary-foreground p-5 sm:p-8 text-center relative overflow-hidden shrink-0">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          
          <img src={logoAsset.url} alt="Logo" className="h-14 w-14 sm:h-20 sm:w-20 mx-auto mb-3 sm:mb-4 bg-white dark:bg-primary/20 rounded-full p-2 relative z-10" />
          <DialogTitle className="font-hindi text-xl sm:text-3xl font-bold mb-2 relative z-10">शीतल शिवालय समिति</DialogTitle>
          <p className="font-hindi text-[11px] sm:text-sm text-primary-foreground/80 relative z-10">
            शीतल सिटी, मंडीदीप, जिला-रायसेन (मध्यप्रदेश) – 462046
          </p>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8 space-y-6 sm:space-y-8">
          <div className="text-center space-y-4">
            <h3 className="font-hindi text-lg sm:text-2xl font-bold text-primary underline decoration-secondary decoration-4 underline-offset-8">{t('donation.title')}</h3>
            <p className="font-hindi text-sm sm:text-base text-foreground/80 leading-relaxed italic">
              {t('donation.msg')}
            </p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Button 
              variant={activeTab === 'qr' ? 'default' : 'outline'} 
              className={`font-hindi rounded-2xl h-12 sm:h-16 text-base sm:text-lg ${activeTab === 'qr' ? 'bg-primary' : 'border-primary text-primary'}`}
              onClick={() => setActiveTab('qr')}
            >
              <QrCode className="mr-2 h-6 w-6" />
              {t('donation.qrTab')}
            </Button>
            <Button 
              variant={activeTab === 'bank' ? 'default' : 'outline'} 
              className={`font-hindi rounded-2xl h-12 sm:h-16 text-base sm:text-lg ${activeTab === 'bank' ? 'bg-primary' : 'border-primary text-primary'}`}
              onClick={() => setActiveTab('bank')}
            >
              <Building2 className="mr-2 h-6 w-6" />
              {t('donation.bankTab')}
            </Button>
          </div>

          {activeTab === 'qr' ? (
            <div className="flex flex-col items-center gap-6 animate-in fade-in duration-500">
              <div className="bg-white dark:bg-primary/5 p-4 sm:p-6 rounded-3xl shadow-2xl border-4 border-secondary/20">
                <img 
                  src={settings?.donation_qr_url || "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=UPI_ID_HERE"} 
                  alt="Donation QR" 
                  className="h-40 w-40 sm:h-48 sm:w-48 md:h-64 md:w-64 object-contain"
                />
              </div>
              <div className="text-center">
                <p className="font-hindi text-lg font-bold text-primary mb-2">{t('donation.qrMethod')}</p>
                {settings?.upi_id && (
                  <Button 
                    variant="ghost" 
                    className="font-inter text-muted-foreground hover:text-primary gap-2 max-w-full whitespace-normal break-all"
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
              <div className="bg-secondary/5 border-2 border-secondary/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="font-hindi text-xs text-muted-foreground uppercase tracking-widest">{t('donation.holder')}</label>
                    <p className="font-hindi text-base sm:text-lg font-bold text-primary break-words">{settings?.bank_account_name || "शीतल शिवालय समिति"}</p>
                  </div>
                  <div>
                    <label className="font-hindi text-xs text-muted-foreground uppercase tracking-widest">{t('donation.bankName')}</label>
                    <p className="font-hindi text-base sm:text-lg font-bold text-primary break-words">{settings?.bank_name || "---"}</p>
                  </div>
                  <div>
                    <label className="font-hindi text-xs text-muted-foreground uppercase tracking-widest">{t('donation.accountNo')}</label>
                    <div className="flex items-center justify-between">
                      <p className="font-inter text-base sm:text-lg font-bold text-primary tracking-wider break-all">{settings?.bank_account_number || "---"}</p>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(settings?.bank_account_number || "")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="font-hindi text-xs text-muted-foreground uppercase tracking-widest">{t('donation.ifsc')}</label>
                    <div className="flex items-center justify-between">
                      <p className="font-inter text-base sm:text-lg font-bold text-primary break-all">{settings?.bank_ifsc || "---"}</p>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(settings?.bank_ifsc || "")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-muted/30 p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-center space-y-2">
            <p className="font-hindi text-sm font-bold text-primary">{t('donation.importance')}</p>
            <p className="font-hindi text-xs text-foreground/70 leading-relaxed">
              {t('donation.importanceMsg')}
            </p>

          </div>

          <div className="border-t border-border/60 pt-3 sm:pt-4 pb-1">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-center">
              <span className="text-[10px] sm:text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                DESIGNED & DEVELOPED BY PAWANPRABHA INFOTECH
              </span>
              <a
                href="https://wa.me/916262013335?text=%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%95%E0%A4%BE%E0%A4%B0%2C%20%E0%A4%B6%E0%A5%80%E0%A4%A4%E0%A4%B2%20%E0%A4%B6%E0%A4%BF%E0%A4%B5%E0%A4%BE%E0%A4%B2%E0%A4%AF%20%E0%A4%B8%E0%A4%AE%E0%A4%BF%E0%A4%A4%E0%A4%BF"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-medium text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 sm:h-4 sm:w-4">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.95.5 3.83 1.46 5.5L2.13 22l4.78-1.35c1.62.88 3.45 1.35 5.32 1.35h.04c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.59 13.66c-.24.68-1.38 1.29-1.92 1.37-.51.08-1 .19-3.35-.69-2.84-1.1-4.66-3.9-4.8-4.09-.14-.18-1.15-1.53-1.15-2.92 0-1.39.72-2.06.98-2.34.26-.28.56-.35.75-.35.18 0 .37 0 .53.01.17 0 .4-.06.62.47.22.54.75 1.91.82 2.05.07.14.12.3.02.48-.1.18-.15.29-.3.45-.15.15-.31.32-.44.43-.14.12-.28.25-.19.49.09.24.42 1.39 1.13 2.04.78.72 1.44.95 1.92 1.05.31.07.58-.04.74-.15.22-.15.95-1.11 1.18-1.49.24-.37.47-.31.62-.25.15.06.98.46 1.15.54.17.08.29.12.33.19.04.06.04.36-.09.75z" />
                </svg>
                <span className="font-inter font-medium">6262013335</span>
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
