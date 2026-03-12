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
  padding: clamp(20px, 2vw, 28px);
  display: flex; /* ← au lieu de grid */
  flex-direction: column;
  gap: 20px;
  
  @media (max-width: 480px) {
    padding: 16px;
    gap: 16px;
  }
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
  background: ${(p) => (p.$isDarkMode 
    ? "rgba(11, 11, 15, 0.8)" 
    : "rgba(255, 255, 255, 0.8)"
  )};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  gap: 24px; /* horizontal seulement */
  border-bottom: 1px solid ${(p) => (p.$isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)")};
  box-shadow: ${(p) => p.$isDarkMode 
    ? "0 4px 20px rgba(0, 0, 0, 0.2)" 
    : "0 4px 20px rgba(0, 0, 0, 0.05)"
  };
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
  padding: 12px 4px 14px;
  position: relative;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:active {
    transform: scale(0.95);
  }
  
  &:focus-visible {
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
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
