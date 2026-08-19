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
    'footer.about': 'हमारे बारे में',
    'footer.quickLinks': 'त्वरित लिंक',
    'footer.contact': 'संपर्क विवरण',
    'footer.support': 'सहयोग करें',
    'footer.readMore': 'और पढ़ें',
    'footer.address': 'पता',
    'footer.mobile': 'मोबाइल नंबर',
    'footer.email': 'ईमेल',
    'footer.donateOnline': 'ऑनलाइन दान दें',
    'footer.followUs': 'फॉलो करें',
    'footer.rights': 'शीतल शिवालय समिति. सर्वाधिकार सुरक्षित।',
    'footer.supportMsg': 'मंदिर के विकास और धार्मिक कार्यों में अपना योगदान देकर पुण्य के भागी बनें।',
    'news.readMore': 'विस्तार से पढ़ें',
    'news.empty': 'अभी कोई विशेष सूचना उपलब्ध नहीं है।',
    'members.desc': 'मंदिर समिति के समर्पित सदस्य जो व्यवस्था और निर्माण कार्यों की देखरेख कर रहे हैं।',
    'about.intro': 'परिचय',
    'about.title': 'शीतल शिवालय मंदिर के बारे में जानें',
    'about.readMore': 'विस्तार से पढ़ें',
    'about.year': 'निर्माण वर्ष',
    'about.service': 'आध्यात्मिक सेवा',
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
    'footer.about': 'About Us',
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact Details',
    'footer.support': 'Support Us',
    'footer.readMore': 'Read More',
    'footer.address': 'Address',
    'footer.mobile': 'Mobile Number',
    'footer.email': 'Email',
    'footer.donateOnline': 'Donate Online',
    'footer.followUs': 'Follow Us',
    'footer.rights': 'Shital Shivalaya Samiti. All Rights Reserved.',
    'footer.supportMsg': 'Contribute to temple development and religious activities to earn merit.',
    'news.readMore': 'Read More',
    'news.empty': 'No updates available at the moment.',
    'members.desc': 'Dedicated members of the temple committee overseeing management and construction activities.',
    'about.intro': 'Introduction',
    'about.title': 'Know about Shital Shivalaya Temple',
    'about.readMore': 'Read More',
    'about.year': 'Est. Year',
    'about.service': 'Spiritual Service',
  },




};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('hi');

  useEffect(() => {
    const saved = localStorage.getItem('temple_lang') as Language;
    if (saved && (saved === 'hi' || saved === 'en')) {
      setLanguageState(saved);
      document.documentElement.lang = saved;
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
