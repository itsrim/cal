import styled from "styled-components";
import { Loader } from "lucide-react";

export const Spinner = styled(Loader)`
  animation: spin 0.9s linear infinite;
  width: 20px;
  height: 20px;
  color: currentColor;
  stroke-width: 2;
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const ListScroll = styled.div`
  flex: 1;
  min-height: 0; /* ← autorise le scroll quand il y a des éléments */
  overflow-y: auto;
  padding-right: 4px;
`;

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  gap: 2px;
  margin-left: auto;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: nowrap;
`;

export const SearchInput = styled.input<{ $isDarkMode: boolean }>`
  flex: 1 1 auto; /* prend tout l'espace dispo */
  min-width: 0; /* important pour éviter le débordement */
  height: 52px;
  padding: 0 16px;
  border-radius: 16px;
  border: 1px solid ${(p) => (p.$isDarkMode ? "#262631" : "#e5e7eb")};
  background-color: ${(p) => (p.$isDarkMode ? "rgba(70, 70, 74, 0.6)" : "rgba(255, 255, 255, 0.9)")};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: ${(p) => (p.$isDarkMode ? "#f5f5f7" : "#1a1a1f")};
  font-size: 16px;
  box-shadow: ${(p) => p.$isDarkMode 
    ? "0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)" 
    : "0 2px 8px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)"
  };
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:focus {
    outline: none;
    border-color: ${(p) => (p.$isDarkMode ? "#8b5cf6" : "#6366f1")};
    box-shadow: ${(p) => p.$isDarkMode 
      ? "0 0 0 3px rgba(139, 92, 246, 0.2), 0 4px 12px rgba(0, 0, 0, 0.3)" 
      : "0 0 0 3px rgba(99, 102, 241, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1)"
    };
    background-color: ${(p) => (p.$isDarkMode ? "rgba(70, 70, 74, 0.8)" : "rgba(255, 255, 255, 1)")};
  }
  
  &::placeholder {
    font-size: 16px;
    color: ${(p) => (p.$isDarkMode ? "#9da3ae" : "#6b7280")};
  }
`;

// wrapper pour mettre une icône DANS le champ
export const InputWrap = styled.div`
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
`;

// variante de l'input avec padding à gauche pour l'icône
export const SearchInputWithLeftIcon = styled(SearchInput)`
  flex: none;
  width: 100%;
  padding-left: 44px; /* place pour l’icône scanner */
`;

// icône scanner positionnée à gauche dans le champ
export const ScanIconBtnLeft = styled.button<{ $isDarkMode: boolean }>`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border: 0;
  background: ${(p) => (p.$isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)")};
  border-radius: 10px;
  color: ${(p) => (p.$isDarkMode ? "#c7c7d1" : "#6b7280")};
  display: grid;
  place-items: center;
  line-height: 0;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover,
  &:focus-visible {
    color: ${(p) => (p.$isDarkMode ? "#e6e6eb" : "#1a1a1f")};
    background: ${(p) => (p.$isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.06)")};
    outline: none;
  }
  
  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const Button = styled.button`
  height: 52px;
  padding: 0 20px;
  border-radius: 16px;
  border: 0;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  font-weight: 700;
  cursor: pointer;
  display: grid;
  place-items: center;
  flex: 0 0 auto; /* ne grandit pas en flex */
  justify-self: start; /* si parent = grid */
  align-self: flex-start; /* si parent = flex */
  white-space: nowrap; /* évite le retour à la ligne */
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4), 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(99, 102, 241, 0.5), 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0) scale(0.98);
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
  }
  
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3), 0 4px 12px rgba(99, 102, 241, 0.4);
  }
`;

export const Card = styled.div<{ $isDarkMode: boolean }>`
  margin-top: 8px;
  padding: 12px;
  border-radius: 16px;
  background-color: ${(p) => (p.$isDarkMode ? "#13131a" : "#f9fafb")};
  border: 1px solid ${(p) => (p.$isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)")};
  box-shadow: ${(p) => p.$isDarkMode 
    ? "0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.02)" 
    : "0 4px 20px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)"
  };
  display: grid;
  gap: 6px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:active {
    transform: scale(0.98);
    box-shadow: ${(p) => p.$isDarkMode 
      ? "0 2px 10px rgba(0, 0, 0, 0.2)" 
      : "0 2px 10px rgba(0, 0, 0, 0.05)"
    };
  }
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

export const LeftRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

export const ProductName = styled.div<{ $isDarkMode: boolean }>`
  color: ${(p) => (p.$isDarkMode ? "#c7c7d1" : "#1a1a1f")};
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  transition: color 0.3s ease;
`;

export const InlineHint = styled.span<{ $isDarkMode: boolean }>`
  color: ${(p) => (p.$isDarkMode ? "#6b7280" : "#9ca3af")};
  font-size: 12px;
  margin-left: 6px;
  transition: color 0.3s ease;
`;

export const Label = styled.span<{ $isDarkMode: boolean }>`
  color: ${(p) => (p.$isDarkMode ? "#9da3ae" : "#6b7280")};
  transition: color 0.3s ease;
`;

export const Value = styled.span<{ $isDarkMode: boolean }>`
  color: ${(p) => (p.$isDarkMode ? "#e6e6eb" : "#1a1a1f")};
  font-weight: 700;
  font-size: 16px;
  transition: color 0.3s ease;
`;

export const Hint = styled.p<{ $isDarkMode: boolean }>`
  color: ${(p) => (p.$isDarkMode ? "#6b7280" : "#9ca3af")};
  margin: 8px 0;
  transition: color 0.3s ease;
`;

export const ErrorHint = styled.p<{ $isDarkMode: boolean }>`
  color: #4f46e5;
  margin: 8px 0;
  transition: color 0.3s ease;
`;

export const Heart = styled.span<{ $active?: boolean; $isDarkMode: boolean }>`
  color: ${(p) => (p.$active ? "#ec4899" : (p.$isDarkMode ? "#e6e6eb" : "#1a1a1f"))};
  font-weight: 700;
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s ease;
`;

export const SearchInputWithClear = styled(SearchInput)`
  /* le SearchInput hérite de "flex: 1 1 260px" → on neutralise */
  flex: none;
  width: 100%;
  padding-right: 40px; /* place pour l'icône custom */
  /* masque la croix native iOS/Chrome */
  &::-webkit-search-cancel-button {
    -webkit-appearance: none;
    appearance: none;
  }
`;

export const ClearIcon = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  border: 0;
  background: transparent;
  padding: 0;
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  cursor: pointer;
  color: #9da3ae;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;

  &:hover,
  &:focus-visible {
    color: #e6e6eb;
    outline: none;
  }
`;

export const InnerTabBar = styled.div<{ $isDarkMode: boolean }>`
  position: relative;
  display: flex;
  gap: 24px;
  border-bottom: 1px solid ${(p) => (p.$isDarkMode ? "#262631" : "#e5e7eb")};
  margin-top: 16px;
  transition: border-color 0.3s ease;
`;

export const InnerTabBtn = styled.button<{ $active?: boolean; $isDarkMode: boolean }>`
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

export const InnerIndicator = styled.div<{ $x: number; $w: number }>`
  position: absolute;
  bottom: 0;
  height: 3px;
  background: #ec4899;
  border-radius: 3px;
  transition: transform 0.25s ease, width 0.25s ease;
  transform: translateX(${(p) => p.$x}px);
  width: ${(p) => p.$w}px;
  pointer-events: none;
`;

export const Section = styled.section`
  padding-top: 12px;
`;

/* input avec bouton clear */
// export const InputWrap = styled.div`
//   position: relative;
//   flex: 1 1 260px;
// `;
// export const SearchInputWithClear = styled(SearchInput)`
//   padding-right: 40px; /* place pour la croix */
// `;
export const ClearBtn = styled.button<{ $isDarkMode: boolean }>`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  height: 32px;
  min-width: 32px;
  padding: 0;
  border: 0;
  border-radius: 12px;
  background: ${(p) => (p.$isDarkMode ? "rgba(38, 38, 49, 0.6)" : "rgba(229, 231, 235, 0.8)")};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: ${(p) => (p.$isDarkMode ? "#c7c7d1" : "#6b7280")};
  cursor: pointer;
  display: grid;
  place-items: center;
  line-height: 1;
  font-size: 16px;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  box-shadow: ${(p) => p.$isDarkMode 
    ? "0 2px 6px rgba(0, 0, 0, 0.2)" 
    : "0 2px 6px rgba(0, 0, 0, 0.05)"
  };
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: ${(p) => (p.$isDarkMode ? "rgba(38, 38, 49, 0.8)" : "rgba(229, 231, 235, 1)")};
    transform: translateY(-50%) scale(1.1);
  }
  
  &:active {
    transform: translateY(-50%) scale(0.95);
  }
`;
export const NutrientGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 8px;
  margin-bottom: 8px;
`;

export const NutrientColumn = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const ColorBar = styled.div<{ $color: string }>`
  width: 3px;
  height: 28px;
  background-color: ${(p) => p.$color};
  border-radius: 2px;
`;

export const NutrientInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const NutrientLabel = styled.div<{ $isDarkMode: boolean }>`
  font-size: 12px;
  color: ${(p) => (p.$isDarkMode ? "#9da3ae" : "#6b7280")};
  line-height: 1.2;
`;

export const NutrientValue = styled.div<{ $isDarkMode: boolean }>`
  font-size: 14px;
  font-weight: 700;
  color: ${(p) => (p.$isDarkMode ? "#e6e6eb" : "#1a1a1f")};
  line-height: 1.2;
`;
