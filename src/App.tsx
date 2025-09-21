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
  font-size: clamp(22px, 2vw + 10px, 32px);
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
  position: relative;
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
  padding: 10px 2px 12px; /* <- contrôle la “hauteur visuelle” */
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
  background: #6366f1;
  border-radius: 3px;
  transition: transform 0.25s ease, width 0.25s ease;
  transform: translateX(${(p) => p.$x}px);
  width: ${(p) => p.$w}px;
`;

// const Panels = styled.div`
//   width: 100%;
//   padding-top: 12px;
// `;

// const Panel = styled.section`
//   width: 100%;
// `;

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
        <Title>Compteur de cals</Title>

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

        {/* <Panels>
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
        </Panels> */}
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
