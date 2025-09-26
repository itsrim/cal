import styled from "styled-components";

export const Container = styled.div<{ $isDarkMode: boolean }>`
  min-height: 100vh;
  background: ${(p) => (p.$isDarkMode ? "#0b0b0f" : "#ffffff")};
  display: flex;
  flex-direction: column;
  transition: background-color 0.3s ease;
`;

export const Title = styled.h1<{ $isDarkMode: boolean }>`
  color: ${(p) => (p.$isDarkMode ? "#e6e6eb" : "#1a1a1f")};
  font-weight: 700;
  margin: 0;
  font-size: clamp(26px, 2vw + 10px, 38px);
  text-align: center;
  font-family: "Dancing Script", cursive;
  font-weight: 700;
  transition: color 0.3s ease;
`;

export const Content = styled.main`
  flex: 1;
  padding: clamp(16px, 2vw, 24px);
  display: flex; /* ← au lieu de grid */
  flex-direction: column;
  gap: 16px;
`;

export const Panel = styled.section`
  width: 100%;
  min-height: 0; /* important pour que l'intérieur puisse scroller */
`;

/* ---------- Tabs ---------- */
export const TabBar = styled.div<{ $isDarkMode: boolean }>`
  position: sticky;
  top: 0; /* colle en haut de la page */
  z-index: 10; /* passe devant le contenu au scroll */
  background: ${(p) => (p.$isDarkMode ? "#0b0b0f" : "#ffffff")}; /* évite la transparence pendant le scroll */
  display: flex;
  gap: 24px; /* horizontal seulement */
  border-bottom: 1px solid ${(p) => (p.$isDarkMode ? "#262631" : "#e5e7eb")};
  transition: background-color 0.3s ease, border-color 0.3s ease;
`;

export const TabBtn = styled.button<{ $active?: boolean; $isDarkMode: boolean }>`
  appearance: none;
  border: 0;
  background: transparent;
  cursor: pointer;
  color: ${(p) => 
    p.$active 
      ? (p.$isDarkMode ? "#e6e6eb" : "#1a1a1f")
      : (p.$isDarkMode ? "#9da3ae" : "#6b7280")
  };
  font-weight: 700;
  font-size: 16px;
  line-height: 1;
  padding: 10px 2px 12px;
  position: relative;
  outline: none;
  transition: color 0.3s ease;
  &:focus-visible {
    box-shadow: 0 0 0 2px #6366f1aa;
    border-radius: 8px;
  }
`;

export const Indicator = styled.div<{ $x: number; $w: number }>`
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

export const TabBarContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;
