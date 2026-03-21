import React from "react";
import { HistoryTab } from "./components/history/HistoryTab";
import { SearchTab } from "./components/search/SearchTab";
import { TrackingTab } from "./components/tracking/TrackingTab";
import { BurgerMenu } from "./components/BurgerMenu";
import { I18nProvider, useI18n, Language } from "./contexts/I18nContext";
import { Search, History, LineChart } from "lucide-react";
import {
  Container,
  Title,
  Content,
  Panel,
  BottomTabBar,
  TabBtn,
  TabBtnLabel,
  Indicator,
  HeaderContainer,
} from "./components/App/StyleApp";


type TabId = "search" | "history" | "suivi";

function AppContent() {
  const { language, setLanguage, t } = useI18n();
  const [active, setActive] = React.useState<TabId>("search");
  const [storageSize, setStorageSize] = React.useState(0);
  const [isDarkMode, setIsDarkMode] = React.useState(true); // Dark mode par défaut
  
  const tabs = [
    { id: "search" as const, label: t('app.tabs.search'), icon: Search },
    { id: "history" as const, label: t('app.tabs.history'), icon: History },
    { id: "suivi" as const, label: t('app.tabs.tracking'), icon: LineChart },
  ];

  // pour l'indicateur (underline)
  const listRef = React.useRef<HTMLDivElement>(null);
  const [underline, setUnderline] = React.useState({ x: 0, w: 0 });
  const updateUnderline = (id: TabId) => {
    const el = listRef.current?.querySelector<HTMLButtonElement>(
      `[data-tab="${id}"]`
    );
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    const baseLeft = listRef.current!.getBoundingClientRect().left;
    setUnderline({ x: left - baseLeft, w: width });
  };
  React.useEffect(() => {
    updateUnderline(active);
  }, [active]);

  // Calculer la taille du localStorage
  const calculateStorageSize = React.useCallback(() => {
    try {
      let totalSize = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          const value = localStorage.getItem(key);
          if (value) {
            totalSize += key.length + value.length;
          }
        }
      }
      // Convertir en Mo (approximatif)
      const sizeInMB = totalSize / (1024 * 1024);
      setStorageSize(Math.round(sizeInMB * 100) / 100);
    } catch {
      setStorageSize(0);
    }
  }, []);

  React.useEffect(() => {
    calculateStorageSize();
  }, [calculateStorageSize]);

  // Charger la préférence du thème depuis le localStorage
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('cal-theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  // Sauvegarder la préférence du thème
  const toggleDarkMode = React.useCallback(() => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('cal-theme', newTheme ? 'dark' : 'light');
  }, [isDarkMode]);

  // Changer de langue
  const toggleLanguage = React.useCallback(() => {
    const newLanguage: Language = language === 'fr' ? 'en' : 'fr';
    setLanguage(newLanguage);
  }, [language, setLanguage]);

  // clavier (← → + Home/End)
  const onKeyDown = (e: React.KeyboardEvent) => {
    const idx = tabs.findIndex((t) => t.id === active);
    if (e.key === "ArrowRight") {
      setActive(tabs[(idx + 1) % tabs.length].id);
      e.preventDefault();
    }
    if (e.key === "ArrowLeft") {
      setActive(tabs[(idx - 1 + tabs.length) % tabs.length].id);
      e.preventDefault();
    }
    if (e.key === "Home") {
      setActive(tabs[0].id);
      e.preventDefault();
    }
    if (e.key === "End") {
      setActive(tabs[tabs.length - 1].id);
      e.preventDefault();
    }
    requestAnimationFrame(() => updateUnderline(active));
  };

  return (
    <Container $isDarkMode={isDarkMode}>
      <Content>
        <HeaderContainer data-menu-container>
          <Title $isDarkMode={isDarkMode}>{t('app.title')}</Title>
          <div style={{ position: "absolute", right: 0 }}>
            <BurgerMenu
              isDarkMode={isDarkMode}
              onToggleDarkMode={toggleDarkMode}
              onToggleLanguage={toggleLanguage}
              storageSize={storageSize}
            />
          </div>
        </HeaderContainer>


        <Panel
          id="panel-search"
          role="tabpanel"
          aria-labelledby="tab-search"
          hidden={active !== "search"}
        >
          {active === "search" && (
            <SearchTab onSaved={() => setActive("history")} isDarkMode={isDarkMode} />
          )}
        </Panel>
        <Panel
          id="panel-history"
          role="tabpanel"
          aria-labelledby="tab-history"
          hidden={active !== "history"}
        >
          {active === "history" && <HistoryTab isDarkMode={isDarkMode} />}
        </Panel>
        <Panel
          id="panel-suivi"
          role="tabpanel"
          aria-labelledby="tab-suivi"
          hidden={active !== "suivi"}
        >
          {active === "suivi" && <TrackingTab isDarkMode={isDarkMode} />}
        </Panel>
      </Content>
      
      <BottomTabBar
        role="tablist"
        aria-label="Navigation principale"
        ref={listRef}
        onKeyDown={onKeyDown}
        $isDarkMode={isDarkMode}
      >
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <TabBtn
              key={t.id}
              data-tab={t.id}
              role="tab"
              aria-selected={active === t.id}
              aria-controls={`panel-${t.id}`}
              id={`tab-${t.id}`}
              $active={active === t.id}
              $isDarkMode={isDarkMode}
              onClick={() => setActive(t.id)}
            >
              <Icon size={24} strokeWidth={active === t.id ? 2.5 : 2} />
              <TabBtnLabel $active={active === t.id} $isDarkMode={isDarkMode}>
                {t.label}
              </TabBtnLabel>
            </TabBtn>
          );
        })}
        <Indicator $x={underline.x} $w={underline.w} />
      </BottomTabBar>
    </Container>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
