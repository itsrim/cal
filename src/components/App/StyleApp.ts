import styled from "styled-components";

export const Container = styled.div<{ $isDarkMode: boolean }>`
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background: ${(p) => (p.$isDarkMode ? "#000000" : "#ffffff")};
  display: flex;
  flex-direction: column;
  transition: background-color 0.3s ease;
`;

export const Title = styled.h1<{ $isDarkMode: boolean }>`
  color: ${(p) => (p.$isDarkMode ? "#ffffff" : "#1a1a1f")};
  font-weight: 800;
  margin: 0;
  font-size: clamp(22px, 2vw + 6px, 28px);
  text-align: center;
  font-family: inherit;
  transition: color 0.3s ease;
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  position: relative;
  height: 48px;
`;

export const Content = styled.main`
  flex: 1;
  padding: clamp(20px, 2vw, 28px);
  padding-bottom: calc(90px + env(safe-area-inset-bottom)); /* Laisse l'espace pour le BottomNav */
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  
  @media (max-width: 480px) {
    padding: 16px;
    gap: 16px;
  }
`;

export const Panel = styled.section`
  width: 100%;
  min-height: 0; /* important pour que l'intérieur puisse scroller */
`;

/* ---------- Bottom Navigation ---------- */
export const BottomTabBar = styled.nav<{ $isDarkMode: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: calc(72px + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  background: ${(p) => (p.$isDarkMode
    ? "rgba(24, 24, 26, 0.85)"
    : "rgba(255, 255, 255, 0.85)"
  )};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid ${(p) => (p.$isDarkMode ? "rgba(255, 255, 255, 0.35)" : "rgba(0, 0, 0, 0.08)")};
  box-shadow: ${(p) => p.$isDarkMode
    ? "0 -4px 20px rgba(0, 0, 0, 0.3)"
    : "0 -4px 20px rgba(0, 0, 0, 0.05)"
  };
  z-index: 50;
  padding-left: 8px;
  padding-right: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

export const TabBtn = styled.button<{ $active?: boolean; $isDarkMode: boolean }>`
  appearance: none;
  border: 0;
  background: ${(p) =>
    p.$active
      ? (p.$isDarkMode ? "rgba(188, 75, 228, 0.15)" : "rgba(236, 72, 153, 0.1)")
      : "transparent"
  };
  cursor: pointer;
  color: ${(p) =>
    p.$active
      ? (p.$isDarkMode ? "#e6e6eb" : "#1a1a1f")
      : (p.$isDarkMode ? "#6b7280" : "#9ca3af")
  };
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 0;
  position: relative;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex: 1;
  border-radius: 12px;
  
  &:active {
    transform: scale(0.92);
  }
`;

export const TabBtnLabel = styled.span<{ $active?: boolean; $isDarkMode: boolean }>`
  font-size: 11px;
  font-weight: ${(p) => (p.$active ? 700 : 500)};
  line-height: 1;
  transition: color 0.3s ease;
`;

export const Indicator = styled.div<{ $x: number; $w: number }>`
  position: absolute;
  top: -1px; /* Align to the top of the tab bar itself */
  left: 0;
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
