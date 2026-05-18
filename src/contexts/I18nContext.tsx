import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Language = "fr" | "en";

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
    "app.title": "Compteur de calories 🍆🍑",
    "app.tabs.search": "Recherche",
    "app.tabs.history": "Historique",
    "app.tabs.tracking": "Suivi",
    "app.tabs.calculator": "Calculateur",
    "app.menu.darkMode": "Mode sombre",
    "app.menu.lightMode": "Mode clair",
    "app.menu.calculator": "Calculateur de calories",
    "app.menu.language": "Langue",
    "app.menu.demo": "démo d'utilisation",
    "app.menu.installation": "Installation",
    "app.menu.clearData": "Effacer données",
    "app.menu.close": "Fermer",
    "app.menu.installInstructions": "Instructions d'installation PWA sur iOS",
    "app.menu.demoAlt": "Démo de l'application",

    // SearchTab
    "search.product": "Produit",
    "search.favorites": "Favoris",
    "search.recents": "Récents",
    "search.scanner": "Scanner",
    "search.searchPlaceholder": "Rechercher",
    "search.loading": "Chargement",
    "search.noProductFound": "Aucun produit trouvé.",
    "search.noRecentSearch": "Aucune recherche récente.",
    "search.noFavorites": "Aucun favori pour le moment.",
    "search.proteins": "Protéines",
    "search.sugars": "Sucres",
    "search.fats": "Lipides",
    "search.save": "Enregistrer",
    "search.placeholder": "Scan ou chercher un aliment (ex: yaourt, pomme...)",
    "search.hint": "Scan ou entre une recherche puis Entrer",

    // HistoryTab
    "history.delete": "Supprimer définitivement",
    "history.totalDay": "Total du jour",
    "history.noFoodToday": "Aucun aliment enregistré ce jour.",
    "history.carbs": "Glucides",
    "history.fats": "Lipides",
    "history.proteins": "Protéines",
    "history.sugars": "Sucres",

    // TrackingTab
    "tracking.previousMonth": "Mois précédent",
    "tracking.nextMonth": "Mois suivant",

    // Calculator
    "calculator.title": "Calculateur de calories",
    "calculator.description":
      "Remplissez vos données pour obtenir un objectif personnalisé et mesurer votre métabolisme de base.",
    "calculator.gender": "Sexe",
    "calculator.man": "Homme",
    "calculator.woman": "Femme",
    "calculator.activityFactor": "Facteur d'activité",
    "calculator.activity.sedentary": "Sédentaire",
    "calculator.activity.light": "Léger",
    "calculator.activity.moderate": "Modéré",
    "calculator.activity.active": "Élevé",
    "calculator.activity.veryActive": "Très élevé",
    "calculator.age": "Âge",
    "calculator.height": "Taille (cm)",
    "calculator.currentWeight": "Poids actuel (kg)",
    "calculator.targetWeight": "Poids cible (kg)",
    "calculator.duration": "Durée (jours)",
    "calculator.submit": "Calculer et enregistrer",
    "calculator.results": "Résultats",
    "calculator.bmr": "BMR",
    "calculator.bmrDescription": "Métabolisme de base",
    "calculator.tdee": "TDEE",
    "calculator.tdeeDescription": "Dépense énergétique journalière",
    "calculator.dailyDeficit": "Déficit/jour",
    "calculator.caloriesPerDay": "Calories max / jour",
    "calculator.perDay": "jour",
    "calculator.emptyState":
      'Remplissez le formulaire à gauche puis cliquez sur "Calculer et enregistrer" pour afficher vos résultats.',
    "calculator.note":
      "Ce calculateur génère un objectif journalier, puis l'enregistre automatiquement pour le suivi.",
    "calculator.objectiveSaved": "Objectif enregistré",
  },
  en: {
    // App.tsx
    "app.title": "Calorie Counter 🍆🍑",
    "app.tabs.search": "Search",
    "app.tabs.history": "History",
    "app.tabs.tracking": "Tracking",
    "app.tabs.calculator": "Calculator",
    "app.menu.darkMode": "Dark mode",
    "app.menu.lightMode": "Light mode",
    "app.menu.calculator": "Calculator Calorie",
    "app.menu.language": "Language",
    "app.menu.demo": "usage demo",
    "app.menu.installation": "Installation",
    "app.menu.clearData": "Clear data",
    "app.menu.close": "Close",
    "app.menu.installInstructions": "PWA installation instructions on iOS",
    "app.menu.demoAlt": "Application demo",

    // SearchTab
    "search.product": "Product",
    "search.favorites": "Favorites",
    "search.recents": "Recent",
    "search.scanner": "Scanner",
    "search.searchPlaceholder": "Search",
    "search.loading": "Loading",
    "search.noProductFound": "No product found.",
    "search.noRecentSearch": "No recent search.",
    "search.noFavorites": "No favorites yet.",
    "search.proteins": "Proteins",
    "search.sugars": "Sugars",
    "search.fats": "Fats",
    "search.save": "Save",
    "search.placeholder": "Scan or search for a food (e.g. yogurt, apple...)",
    "search.hint": "Scan or enter a search then Enter",

    // HistoryTab
    "history.delete": "Delete permanently",
    "history.totalDay": "Daily total",
    "history.noFoodToday": "No food recorded today.",
    "history.carbs": "Carbs",
    "history.fats": "Fats",
    "history.proteins": "Proteins",
    "history.sugars": "Sugars",

    // TrackingTab
    "tracking.previousMonth": "Previous month",
    "tracking.nextMonth": "Next month",

    // Calculator
    "calculator.title": "Calorie calculator",
    "calculator.description":
      "Enter your data to get a personalized goal and see your basal metabolic rate.",
    "calculator.gender": "Gender",
    "calculator.man": "Man",
    "calculator.woman": "Woman",
    "calculator.activityFactor": "Activity factor",
    "calculator.activity.sedentary": "Sedentary",
    "calculator.activity.light": "Light",
    "calculator.activity.moderate": "Moderate",
    "calculator.activity.active": "Active",
    "calculator.activity.veryActive": "Very active",
    "calculator.age": "Age",
    "calculator.height": "Height (cm)",
    "calculator.currentWeight": "Current weight (kg)",
    "calculator.targetWeight": "Target weight (kg)",
    "calculator.duration": "Duration (days)",
    "calculator.submit": "Calculate and save",
    "calculator.results": "Results",
    "calculator.bmr": "BMR",
    "calculator.bmrDescription": "Basal metabolic rate",
    "calculator.tdee": "TDEE",
    "calculator.tdeeDescription": "Total daily energy expenditure",
    "calculator.dailyDeficit": "Daily deficit",
    "calculator.caloriesPerDay": "Max calories/day",
    "calculator.perDay": "day",
    "calculator.emptyState":
      'Fill the form on the left and click "Calculate and save" to view your results.',
    "calculator.note":
      "This calculator creates a daily goal and saves it automatically for tracking.",
    "calculator.objectiveSaved": "Goal saved",
  },
};

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguageState] = useState<Language>("fr");

  // Charger la langue depuis le localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("cal-language") as Language;
    if (savedLanguage && (savedLanguage === "fr" || savedLanguage === "en")) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Sauvegarder la langue
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("cal-language", lang);
  };

  // Fonction de traduction
  const t = (key: string): string => {
    return (
      translations[language][
        key as keyof (typeof translations)[typeof language]
      ] || key
    );
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
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
