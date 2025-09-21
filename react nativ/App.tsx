import React from "react";
import styled from "styled-components";
import HistoryTab from "./HistoryTab";
import SearchTab from "./SearchTab";

const Container = styled.div`
  min-height: 100vh;
  background-color: #0b0b0f;
  display: flex;
  flex-direction: column;
`;

const Content = styled.main`
  flex: 1;
  padding: 24px;
  display: grid;
  gap: 16px;
  max-width: 1100px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #e6e6eb;
  font-size: clamp(22px, 2vw + 10px, 32px);
  font-weight: 700;
  margin: 0;
`;

/* ----- Tabs (ARIA) ----- */
const TabList = styled.div`
  display: flex;
  gap: 10px;
`;

const Tab = styled.button<{ $active?: boolean }>`
  appearance: none;
  border: 0;
  border-radius: 12px;
  padding: 10px 14px;
  background-color: ${(p) => (p.$active ? "#4f46e5" : "#1a1a22")};
  color: #f5f5f7;
  font-weight: 700;
  cursor: pointer;
  outline: none;
  transition: transform 0.02s ease;
  &:active {
    transform: translateY(1px);
  }
  &:focus-visible {
    box-shadow: 0 0 0 2px #6366f1aa;
  }
`;

const TabPanel = styled.section`
  outline: none;
`;

type TabId = "search" | "history";

export default function App() {
  const [active, setActive] = React.useState<TabId>("history");
  const tabs: { id: TabId; label: string }[] = [
    { id: "search", label: "Recherche" },
    { id: "history", label: "Historique" },
  ];

  // Gestion clavier : ← → pour naviguer, Entrée/Espace pour activer
  const listRef = React.useRef<HTMLDivElement>(null);
  const onKeyDown = (e: React.KeyboardEvent) => {
    const idx = tabs.findIndex((t) => t.id === active);
    if (e.key === "ArrowRight") {
      const next = tabs[(idx + 1) % tabs.length].id;
      setActive(next);
      focusTab(next);
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      const prev = tabs[(idx - 1 + tabs.length) % tabs.length].id;
      setActive(prev);
      focusTab(prev);
      e.preventDefault();
    }
  };
  const focusTab = (id: TabId) => {
    const el = listRef.current?.querySelector<HTMLButtonElement>(
      `[data-tab="${id}"]`
    );
    el?.focus();
  };

  return (
    <Container>
      <Content>
        <Title>Compteur de cals</Title>
        <TabList
          role="tablist"
          aria-label="Onglets principales"
          ref={listRef}
          onKeyDown={onKeyDown}
        >
          {tabs.map((t) => (
            <Tab
              key={t.id}
              data-tab={t.id}
              role="tab"
              aria-selected={active === t.id}
              aria-controls={`panel-${t.id}`}
              id={`tab-${t.id}`}
              $active={active === t.id}
              onClick={() => setActive(t.id)}
            >
              {t.label}
            </Tab>
          ))}
        </TabList>

        <TabPanel
          id={`panel-history`}
          role="tabpanel"
          aria-labelledby={`tab-history`}
          hidden={active !== "history"}
        >
          {active === "history" && <HistoryTab />}
        </TabPanel>

        <TabPanel
          id={`panel-search`}
          role="tabpanel"
          aria-labelledby={`tab-search`}
          hidden={active !== "search"}
        >
          {active === "search" && (
            <SearchTab onSaved={() => setActive("history")} />
          )}
        </TabPanel>
      </Content>
    </Container>
  );
}
