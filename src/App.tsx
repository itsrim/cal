import React from "react";
import styled from "styled-components";
import { HistoryTab } from "./components/history/HistoryTab";
import { SearchTab } from "./components/search/SearchTab";
import { TrackingTab } from "./components/tracking/TrackingTab";
import CalorieForm from "./components/calculator/CalorieForm";
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
  const [calculatorModalOpen, setCalculatorModalOpen] = React.useState(false);

  const tabs = [
    { id: "search" as const, label: t("app.tabs.search"), icon: Search },
    { id: "history" as const, label: t("app.tabs.history"), icon: History },
    { id: "suivi" as const, label: t("app.tabs.tracking"), icon: LineChart },
  ];

  // pour l'indicateur (underline)
  const listRef = React.useRef<HTMLDivElement>(null);
  const [underline, setUnderline] = React.useState({ x: 0, w: 0 });
  const updateUnderline = (id: TabId) => {
    const el = listRef.current?.querySelector<HTMLButtonElement>(
      `[data-tab="${id}"]`,
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
    const savedTheme = localStorage.getItem("cal-theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }

    const calculatorSeen = localStorage.getItem("cal-calculator-seen");
    if (!calculatorSeen) {
      setCalculatorModalOpen(true);
    }
  }, []);

  // Sauvegarder la préférence du thème
  const toggleDarkMode = React.useCallback(() => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("cal-theme", newTheme ? "dark" : "light");
  }, [isDarkMode]);

  const closeCalculatorModal = React.useCallback(() => {
    setCalculatorModalOpen(false);
    localStorage.setItem("cal-calculator-seen", "true");
  }, []);

  const openCalculatorModal = React.useCallback(() => {
    setCalculatorModalOpen(true);
  }, []);

  // Changer de langue
  const toggleLanguage = React.useCallback(() => {
    const newLanguage: Language = language === "fr" ? "en" : "fr";
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
          <Title $isDarkMode={isDarkMode}>{t("app.title")}</Title>
          <div style={{ position: "absolute", right: 0 }}>
            <BurgerMenu
              isDarkMode={isDarkMode}
              onToggleDarkMode={toggleDarkMode}
              onToggleLanguage={toggleLanguage}
              onOpenCalculatorModal={openCalculatorModal}
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
            <SearchTab
              onSaved={() => setActive("history")}
              isDarkMode={isDarkMode}
            />
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

      <ModalOverlay $open={calculatorModalOpen} onClick={closeCalculatorModal}>
        <ModalContent
          $isDarkMode={isDarkMode}
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader $isDarkMode={isDarkMode}>
            <ModalTitle $isDarkMode={isDarkMode}>
              {t("app.menu.calculator")}
            </ModalTitle>
            <ModalClose
              type="button"
              $isDarkMode={isDarkMode}
              onClick={closeCalculatorModal}
              aria-label={t("app.menu.close")}
            >
              ×
            </ModalClose>
          </ModalHeader>
          <CalorieForm isDarkMode={isDarkMode} />
        </ModalContent>
      </ModalOverlay>

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

const ModalOverlay = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.68);
  backdrop-filter: blur(8px);
  display: ${(p) => (p.$open ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 2000;
`;

const ModalContent = styled.div<{ $isDarkMode: boolean }>`
  width: min(900px, 98vw);
  max-height: 92vh;
  overflow-y: auto;
  border-radius: 28px;
  background: ${(p) => (p.$isDarkMode ? "#0e0e16" : "#ffffff")};
  box-shadow: 0 40px 120px rgba(0, 0, 0, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.08);

  @media (max-width: 760px) {
    width: calc(100vw - 32px);
    max-height: 95vh;
  }
`;

const ModalHeader = styled.div<{ $isDarkMode: boolean }>`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 24px 28px 18px;
  gap: 16px;
  border-bottom: 1px solid
    ${(p) => (p.$isDarkMode ? "rgba(255,255,255,0.08)" : "#e5e7eb")};
`;

const ModalHeaderContent = styled.div`
  display: grid;
  gap: 8px;
`;

const ModalTitle = styled.h3<{ $isDarkMode: boolean }>`
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: ${(p) => (p.$isDarkMode ? "#f8fafc" : "#111827")};
`;

const ModalSubtitle = styled.p<{ $isDarkMode: boolean }>`
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  max-width: 540px;
  color: ${(p) => (p.$isDarkMode ? "#cbd5e1" : "#4b5563")};
`;

const ModalClose = styled.button<{ $isDarkMode: boolean }>`
  appearance: none;
  border: 0;
  background: rgba(255, 255, 255, 0.08);
  color: ${(p) => (p.$isDarkMode ? "#f8fafc" : "#111827")};
  font-size: 26px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  transition:
    transform 0.2s ease,
    background 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.14);
  }
`;

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
