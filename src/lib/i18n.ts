import { useState, useEffect, createContext, useContext } from 'react';

type Language = 'hi' | 'en';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  hi: {
    'nav.home': 'होम',
    'nav.about': 'मंदिर के बारे में',
    'nav.live': 'लाइव दर्शन',
    'nav.news': 'विशेष सूचना',
    'nav.gallery': 'गैलरी',
    'nav.members': 'सदस्य',
    'nav.contact': 'संपर्क',
    'action.donate': 'दान करें',
    'footer.admin': 'एडमिन लॉगिन',
    'notice.label': 'महत्वपूर्ण सूचना',
    'news.updates': 'अपडेट्स',
    'news.important': 'महत्वपूर्ण विशेष सूचना',
    'news.viewAll': 'सभी विशेष सूचना देखें',
    'members.officials': 'प्रमुख पदाधिकारी',
    'members.viewAll': 'सभी पदाधिकारी एवं सदस्य देखें',
    'about.devotees': 'भक्त जुड़ाव',
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About Temple',
    'nav.live': 'Live Darshan',
    'nav.news': 'Important News',
    'nav.gallery': 'Gallery',
    'nav.members': 'Members',
    'nav.contact': 'Contact',
    'action.donate': 'Donate',
    'footer.admin': 'Admin Login',
    'notice.label': 'Important Notice',
    'news.updates': 'Updates',
    'news.important': 'Important Updates',
    'news.viewAll': 'View All News',
    'members.officials': 'Key Officials',
    'members.viewAll': 'View All Members',
    'about.devotees': 'Devotee Connection',
  },
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('hi');

  useEffect(() => {
    const saved = localStorage.getItem('temple_lang') as Language;
    if (saved && (saved === 'hi' || saved === 'en')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('temple_lang', lang);
    document.documentElement.lang = lang;
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useLanguage must be used within an I18nProvider');
  }
  return context;
}
