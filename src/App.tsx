import React from "react";
import styled from "styled-components";
import { HistoryTab } from "./components/HistoryTab";
import { SearchTab } from "./components/SearchTab";

const Container = styled.div`
  min-height: 100vh;
  background: #0b0b0f;
  display: flex;
  flex-direction: column;
`;
const Title = styled.h1`
  color: #e6e6eb;
  font-weight: 700;
  margin: 0;
  font-size: clamp(26px, 2vw + 10px, 38px);
  text-align: center;
  font-family: "Dancing Script", cursive;
  font-weight: 700;
`;

const Content = styled.main`
  flex: 1;
  padding: clamp(16px, 2vw, 24px);
  display: flex; /* ← au lieu de grid */
  flex-direction: column;
  gap: 16px;
`;

const Panel = styled.section`
  width: 100%;
  min-height: 0; /* important pour que l’intérieur puisse scroller */
`;
/* ---------- Tabs ---------- */
const TabBar = styled.div`
  position: sticky;
  top: 0; /* colle en haut de la page */
  z-index: 10; /* passe devant le contenu au scroll */
  background: #0b0b0f; /* évite la transparence pendant le scroll */
  display: flex;
  gap: 24px; /* horizontal seulement */
  border-bottom: 1px solid #262631;
`;

const TabBtn = styled.button<{ $active?: boolean }>`
  appearance: none;
  border: 0;
  background: transparent;
  cursor: pointer;
  color: ${(p) => (p.$active ? "#e6e6eb" : "#9da3ae")};
  font-weight: 700;
  font-size: 16px;
  line-height: 1;
  padding: 10px 2px 12px;
  position: relative;
  outline: none;
  &:focus-visible {
    box-shadow: 0 0 0 2px #6366f1aa;
    border-radius: 8px;
  }
`;

const Indicator = styled.div<{ $x: number; $w: number }>`
  position: absolute;
  bottom: 0;
  height: 3px;
  border-radius: 3px;
  transition: transform 0.25s ease, width 0.25s ease;
  transform: translateX(${(p) => p.$x}px);
  width: ${(p) => p.$w}px;
  /* Dégradé + animation */
  background: linear-gradient(
    90deg,
    #ec4899 0%,
    /* rose */ rgb(188, 75, 228) 50%,
    /* violet intermédiaire */ rgba(99, 102, 241, 0.67) 100%
      /* indigo #6366f1aa */
  );
  background-size: 200% 100%; /* plus large pour l’animation */
  animation: gradientShift 2.2s ease-in-out infinite alternate;
  @keyframes gradientShift {
    0% {
      background-position: 0% 0;
    }
    100% {
      background-position: 100% 0;
    }
  }
`;

type TabId = "search" | "history";

export default function App() {
  const [active, setActive] = React.useState<TabId>("search");
  const tabs = [
    { id: "search" as const, label: "Recherche" },
    { id: "history" as const, label: "Historique" },
  ];

  // pour l’indicateur (underline)
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
    <Container>
      <Content>
        <Title>Compteur de calories 🍆🍑</Title>

        <TabBar
          role="tablist"
          aria-label="Navigation principale"
          ref={listRef}
          onKeyDown={onKeyDown}
        >
          {tabs.map((t) => (
            <TabBtn
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
            </TabBtn>
          ))}
          <Indicator $x={underline.x} $w={underline.w} />
        </TabBar>

        <Panel
          id="panel-search"
          role="tabpanel"
          aria-labelledby="tab-search"
          hidden={active !== "search"}
        >
          {active === "search" && (
            <SearchTab onSaved={() => setActive("history")} />
          )}
        </Panel>
        <Panel
          id="panel-history"
          role="tabpanel"
          aria-labelledby="tab-history"
          hidden={active !== "history"}
        >
          {active === "history" && <HistoryTab />}
        </Panel>
      </Content>
    </Container>
  );
}
