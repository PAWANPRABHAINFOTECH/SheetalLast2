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
    'nav.members': "'''Do not make any visual modifications. The phrases I write are commands to understand what I want, not to be written down. Understand their content well, then execute what is required.'''\n                                        \n                                            \n                                            Restore the project to the exact state it was in immediately BEFORE the most recent ZIP backup/export was created.\n\nTreat the most recent ZIP version as the reference point and undo only the changes made after that ZIP was created.\n\nImportant requirements:\n\nDo not redesign the website.\n\nDo not change the existing layout, colors, typography, images, navigation, responsive design, or functionality that existed before the ZIP.\n\nDo not remove any features that were already present before the ZIP.\n\nDo not add any new features.\n\nDo not create new settings, database tables, components, or duplicate functionality.\n\nRestore the previous working code/state as accurately as possible.\n\nPreserve the existing Admin Panel, database structure, authentication, language system, forms, and all previously working functionality.\n\nDo not make any changes related to the domain, GitHub, Hostinger, or deployment configuration.\n\nThe goal is rollback only, not improvement or modification.\n\nAfter the rollback, verify that the project matches the condition it had immediately before the latest ZIP backup/export was created.",
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
    'donation.title': 'आपका योगदान',
    'donation.msg': '"आपके योगदान से प्रभु की पूजा, आयोजन और सामाजिक गतिविधियाँ पूरी होती हैं। आपका दान मंदिर के विकास और सेवाओं को बेहतर बनाने में मदद करता है।"',
    'donation.qrTab': 'QR कोड',
    'donation.bankTab': 'बैंक विवरण',
    'donation.qrMethod': 'UPI / QR द्वारा दान करें',
    'donation.holder': 'खाता धारक',
    'donation.bankName': 'बैंक का नाम',
    'donation.accountNo': 'खाता संख्या',
    'donation.ifsc': 'IFSC कोड',
    'donation.importance': 'आपके योगदान का महत्व',
    'donation.importanceMsg': 'आपका दान भगवान के आशीर्वाद से समाज के उत्थान में सहायक होगा। हम आपके योगदान के लिए हमेशा आभारी रहेंगे।',
    'contact.title': 'संपर्क करें',
    'contact.subtitle': 'हमसे संपर्क करें',
    'contact.name': 'पूरा नाम',
    'contact.mobile': 'मोबाइल नंबर',
    'contact.email': 'ईमेल (वैकल्पिक)',
    'contact.message': 'संदेश',
    'contact.submit': 'संदेश भेजें',
    'contact.placeholder.name': 'अपना नाम लिखें',
    'contact.placeholder.mobile': 'अपना मोबाइल नंबर लिखें',
    'contact.placeholder.email': 'अपना ईमेल लिखें',
    'contact.placeholder.message': 'अपना संदेश यहाँ लिखें',
    'contact.success': 'आपका संदेश प्राप्त हो गया, धन्यवाद!',
    'contact.error': 'संदेश भेजने में त्रुटि हुई, कृपया पुनः प्रयास करें',
    'contact.validate.name': 'कृपया अपना नाम लिखें',
    'contact.validate.mobile': 'कृपया सही मोबाइल नंबर लिखें',
    'contact.validate.email': 'कृपया सही ईमेल लिखें',
    'contact.validate.message': 'कृपया संदेश लिखें',
    'contact.validate.check': 'कृपया विवरण जाँचें',
    'testimonials.title': 'भक्तों के अनुभव',
    'comments.title': 'अपनी प्रतिक्रिया दें',
    'comments.name': 'नाम',
    'comments.mobile': 'मोबाइल नंबर (वैकल्पिक)',
    'comments.message': 'प्रतिक्रिया',
    'comments.submit': 'प्रतिक्रिया भेजें',
    'comments.name_placeholder': 'आपका नाम',
    'comments.message_placeholder': 'अपनी टिप्पणी लिखें...',
    'comments.success': 'आपकी प्रतिक्रिया भेज दी गई है। एडमिन की अनुमति के बाद यह दिखाई देगी।',
    'comments.error_fields': 'कृपया नाम और टिप्पणी भरें',
    'comments.recent': 'हालिया प्रतिक्रियाएँ',
    'comments.empty': 'अभी तक कोई प्रतिक्रिया नहीं है। पहली प्रतिक्रिया आप दें!',
    'यूट्यूब चैनल': 'यूट्यूब चैनल',
    'विशेष झलकियां': 'विशेष झलकियां',
    'चैनल देखें': 'चैनल देखें',
    'और वीडियो देखें': 'और वीडियो देखें',
    'brand.name': 'शीतल शिवालय समिति',
    'brand.subtitle': 'शीतल सिटी, मंडीदीप, जिला-रायसेन (मध्यप्रदेश)',
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
    'donation.title': 'Your Contribution',
    'donation.msg': '"Your contribution fulfills the Lord\'s worship, events, and social activities. Your donation helps in temple development and improving services."',
    'donation.qrTab': 'QR Code',
    'donation.bankTab': 'Bank Details',
    'donation.qrMethod': 'Donate via UPI / QR',
    'donation.holder': 'Account Holder',
    'donation.bankName': 'Bank Name',
    'donation.accountNo': 'Account Number',
    'donation.ifsc': 'IFSC Code',
    'donation.importance': 'Importance of Your Contribution',
    'donation.importanceMsg': 'Your donation will help in the upliftment of society with the Lord\'s blessings. We will always be grateful for your contribution.',
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Get in Touch',
    'contact.name': 'Full Name',
    'contact.mobile': 'Mobile Number',
    'contact.email': 'Email (Optional)',
    'contact.message': 'Message',
    'contact.submit': 'Send Message',
    'contact.placeholder.name': 'Enter your name',
    'contact.placeholder.mobile': 'Enter your mobile number',
    'contact.placeholder.email': 'Enter your email',
    'contact.placeholder.message': 'Enter your message here',
    'contact.success': 'Your message has been received, thank you!',
    'contact.error': 'Error sending message, please try again',
    'contact.validate.name': 'Please enter your name',
    'contact.validate.mobile': 'Please enter a valid mobile number',
    'contact.validate.email': 'Please enter a valid email',
    'contact.validate.message': 'Please enter a message',
    'contact.validate.check': 'Please check details',
    'testimonials.title': 'Devotee Experiences',
    'comments.title': 'Give Your Feedback',
    'comments.name': 'Name',
    'comments.mobile': 'Mobile Number (Optional)',
    'comments.message': 'Feedback',
    'comments.submit': 'Send Feedback',
    'comments.name_placeholder': 'Your name',
    'comments.message_placeholder': 'Write your comment...',
    'comments.success': 'Your feedback has been sent. It will appear after admin approval.',
    'comments.error_fields': 'Please fill name and comment',
    'comments.recent': 'Recent Feedback',
    'comments.empty': 'No feedback yet. Be the first to give one!',
    'यूट्यूब चैनल': 'YouTube Channel',
    'विशेष झलकियां': 'Special Highlights',
    'चैनल देखें': 'View Channel',
    'और वीडियो देखें': 'More Videos',
    'brand.name': 'Sheetal Shivalaya Samiti',
    'brand.subtitle': 'Sheetal City, Mandideep, District-Raisen (M.P.)',
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

export const useI18n = useLanguage;

