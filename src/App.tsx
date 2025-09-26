import React from "react";
import styled from "styled-components";
import { Menu, X } from "lucide-react";
import { HistoryTab } from "./components/history/HistoryTab";
import { SearchTab } from "./components/search/SearchTab";
import { TrackingTab } from "./components/tracking/TrackingTab";
import { storage } from "./utils/storage";

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
  background-size: 200% 100%; /* plus large pour l'animation */
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

const BurgerButton = styled.button`
  appearance: none;
  border: 0;
  background: transparent;
  cursor: pointer;
  color: #9da3ae;
  padding: 10px 8px;
  margin-left: auto;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    color: #e6e6eb;
    background: rgba(255, 255, 255, 0.05);
  }
  
  &:focus-visible {
    box-shadow: 0 0 0 2px #6366f1aa;
  }
`;

const MenuDropdown = styled.div<{ $open: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: #1a1a1f;
  border: 1px solid #262631;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  min-width: 200px;
  z-index: 1000;
  opacity: ${(p) => (p.$open ? 1 : 0)};
  visibility: ${(p) => (p.$open ? 'visible' : 'hidden')};
  transform: ${(p) => (p.$open ? 'translateY(0)' : 'translateY(-8px)')};
  transition: all 0.2s ease;
  margin-top: 8px;
`;

const MenuItem = styled.button`
  appearance: none;
  border: 0;
  background: transparent;
  cursor: pointer;
  color: #e6e6eb;
  padding: 12px 16px;
  width: 100%;
  text-align: left;
  font-size: 14px;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #262631;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  
  &:focus-visible {
    outline: 2px solid #6366f1aa;
    outline-offset: -2px;
  }
`;

const StorageSize = styled.span`
  color: #ef4444;
  font-weight: 600;
`;

const ModalOverlay = styled.div<{ $open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: ${(p) => (p.$open ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
`;

const ModalContent = styled.div`
  position: relative;
  background: #1a1a1f;
  border-radius: 16px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
`;

const ModalImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  appearance: none;
  border: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
`;

const TabBarContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

type TabId = "search" | "history" | "suivi";

export default function App() {
  const [active, setActive] = React.useState<TabId>("search");
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [pwaModalOpen, setPwaModalOpen] = React.useState(false);
  const [demoModalOpen, setDemoModalOpen] = React.useState(false);
  const [storageSize, setStorageSize] = React.useState(0);
  
  const tabs = [
    { id: "search" as const, label: "Recherche" },
    { id: "history" as const, label: "Historique" },
    { id: "suivi" as const, label: "Suivi" },
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

  // Effacer le localStorage
  const clearStorage = React.useCallback(async () => {
    try {
      await storage.removeItem("cal-history-v1");
      await storage.removeItem("cal-recents-v1");
      await storage.removeItem("cal-favorites-v1");
      // Effacer aussi le localStorage directement
      localStorage.clear();
      setMenuOpen(false);
      // Recharger la page pour mettre à jour l'interface
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de l'effacement des données:", error);
    }
  }, []);

  // Fermer le menu quand on clique ailleurs
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuOpen) {
        // Ne pas fermer si on clique dans le menu déroulant ou sur le bouton burger
        const target = event.target as Element;
        if (!target.closest('[data-menu-dropdown]') && !target.closest('[data-burger-button]')) {
          setMenuOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

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

        <TabBarContainer data-menu-container>
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
          
          <BurgerButton
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            aria-expanded={menuOpen}
            data-burger-button
          >
            <Menu size={20} />
          </BurgerButton>
          
          <MenuDropdown $open={menuOpen} data-menu-dropdown onClick={(e) => e.stopPropagation()}>
            <MenuItem onClick={(e) => {
              e.stopPropagation();
              clearStorage();
            }}>
              Effacer données (<StorageSize>{storageSize} Mo</StorageSize>)
            </MenuItem>
            <MenuItem onClick={(e) => {
              e.stopPropagation();
              setPwaModalOpen(true);
              setMenuOpen(false);
            }}>
              demo
            </MenuItem>
            <MenuItem onClick={(e) => {
              e.stopPropagation();
              setDemoModalOpen(true);
              setMenuOpen(false);
            }}>
              Installation
            </MenuItem>
          </MenuDropdown>
        </TabBarContainer>

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
        <Panel
          id="panel-suivi"
          role="tabpanel"
          aria-labelledby="tab-suivi"
          hidden={active !== "suivi"}
        >
          {active === "suivi" && <TrackingTab />}
        </Panel>
      </Content>
      
      {/* Modal PWA */}
      <ModalOverlay $open={pwaModalOpen} onClick={() => setPwaModalOpen(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={() => setPwaModalOpen(false)}>
            <X size={20} />
          </CloseButton>
          <ModalImage 
            src="/cal/pwa_ios.png" 
            alt="Instructions d'installation PWA sur iOS"
          />
        </ModalContent>
      </ModalOverlay>
      <ModalOverlay $open={demoModalOpen} onClick={() => setDemoModalOpen(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={() => setDemoModalOpen(false)}>
            <X size={20} />
          </CloseButton>
          <ModalImage 
            src="/cal/demo.gif" 
            alt="Démo de l'application"
          />
        </ModalContent>
      </ModalOverlay>
    </Container>
  );
}
