import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'fr' | 'en';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Traductions
const translations = {
  fr: {
    // App.tsx
    'app.title': 'Compteur de calories 🍆🍑',
    'app.tabs.search': 'Recherche',
    'app.tabs.history': 'Historique',
    'app.tabs.tracking': 'Suivi',
    'app.menu.darkMode': 'Mode sombre',
    'app.menu.lightMode': 'Mode clair',
    'app.menu.language': 'Langue',
    'app.menu.demo': 'démo d\'utilisation',
    'app.menu.installation': 'Installation',
    'app.menu.clearData': 'Effacer données',
    'app.menu.close': 'Fermer',
    'app.menu.installInstructions': 'Instructions d\'installation PWA sur iOS',
    'app.menu.demoAlt': 'Démo de l\'application',
    
    // SearchTab
    'search.product': 'Produit',
    'search.favorites': 'Favoris',
    'search.recents': 'Récents',
    'search.scanner': 'Scanner',
    'search.searchPlaceholder': 'Rechercher',
    'search.loading': 'Chargement',
    
    // HistoryTab
    'history.delete': 'Supprimer définitivement',
    
    // TrackingTab
    'tracking.previousMonth': 'Mois précédent',
    'tracking.nextMonth': 'Mois suivant',
  },
  en: {
    // App.tsx
    'app.title': 'Calorie Counter 🍆🍑',
    'app.tabs.search': 'Search',
    'app.tabs.history': 'History',
    'app.tabs.tracking': 'Tracking',
    'app.menu.darkMode': 'Dark mode',
    'app.menu.lightMode': 'Light mode',
    'app.menu.language': 'Language',
    'app.menu.demo': 'usage demo',
    'app.menu.installation': 'Installation',
    'app.menu.clearData': 'Clear data',
    'app.menu.close': 'Close',
    'app.menu.installInstructions': 'PWA installation instructions on iOS',
    'app.menu.demoAlt': 'Application demo',
    
    // SearchTab
    'search.product': 'Product',
    'search.favorites': 'Favorites',
    'search.recents': 'Recent',
    'search.scanner': 'Scanner',
    'search.searchPlaceholder': 'Search',
    'search.loading': 'Loading',
    
    // HistoryTab
    'history.delete': 'Delete permanently',
    
    // TrackingTab
    'tracking.previousMonth': 'Previous month',
    'tracking.nextMonth': 'Next month',
  }
};

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguageState] = useState<Language>('fr');

  // Charger la langue depuis le localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('cal-language') as Language;
    if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Sauvegarder la langue
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('cal-language', lang);
  };

  // Fonction de traduction
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
