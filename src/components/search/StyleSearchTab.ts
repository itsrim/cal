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
  width: 100%;
`;

export const SearchInput = styled.input<{ $isDarkMode: boolean }>`
  flex: 1 1 auto; /* prend tout l'espace dispo */
  min-width: 100%; /* important pour éviter le débordement */
  height: 52px;
  padding: 0 16px;
  border-radius: 16px;
  border: ${(p) => (p.$isDarkMode ? "1px solid rgba(255, 255, 255, 0.32)" : "1px solid #e5e7eb")};
  background-color: ${(p) => (p.$isDarkMode ? "#2c2c2e" : "rgba(255, 255, 255, 0.9)")};
  color: ${(p) => (p.$isDarkMode ? "#f5f5f7" : "#1a1a1f")};
  font-size: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:focus {
    outline: none;
    border-color: ${(p) => (p.$isDarkMode ? "#8b5cf6" : "#6366f1")};
    background-color: ${(p) => (p.$isDarkMode ? "#3a3a3c" : "rgba(255, 255, 255, 1)")};
  }
  
  &::placeholder {
    font-size: 15px;
    color: ${(p) => (p.$isDarkMode ? "#8E8E93" : "#6b7280")};
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
  padding-left: 52px; /* place pour l’icône scanner élargie */
`;

// icône scanner positionnée à gauche dans le champ
export const ScanIconBtnLeft = styled.button<{ $isDarkMode: boolean }>`
  position: absolute;
  left: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border: 0;
  background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
  border-radius: 12px;
  color: #ffffff;
  display: grid;
  place-items: center;
  line-height: 0;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);

  &:hover,
  &:focus-visible {
    opacity: 0.9;
    outline: none;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.5);
  }
  
  &:active {
    transform: translateY(-50%) scale(0.92);
  }

  svg {
    width: 22px;
    height: 22px;
  }
`;

export const Button = styled.button`
  height: 52px;
  padding: 0 20px;
  border-radius: 16px;
  border: 0;
  background: linear-gradient(135deg, #9f7aea 0%, #8b5cf6 100%);
  color: white;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 auto; /* ne grandit pas en flex */
  white-space: nowrap; /* évite le retour à la ligne */
  transition: all 0.2s ease;
  
  &:hover {
    filter: brightness(1.1);
  }
  
  &:active {
    transform: scale(0.97);
  }
  
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.4);
  }
`;

export const SearchIconButton = styled(Button)`
  width: 52px;
  padding: 0;
  border-radius: 16px;
`;

export const SaveButton = styled(Button)`
  width: 100%;
  border-radius: 14px;
`;

export const Card = styled.div<{ $isDarkMode: boolean }>`
  margin-top: 8px;
  padding: 16px;
  border-radius: 20px;
  background-color: ${(p) => (p.$isDarkMode ? "#121212" : "#ffffff")};
  border: ${(p) => (p.$isDarkMode ? "1px solid rgba(255, 255, 255, 0.32)" : "1px solid #e5e7eb")};
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:active {
    transform: scale(0.98);
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
  color: ${(p) => (p.$isDarkMode ? "#ffffff" : "#1a1a1f")};
  font-size: 15px;
  font-weight: 700;
  line-height: 1.2;
  transition: color 0.3s ease;
`;

export const InlineHint = styled.span<{ $isDarkMode: boolean }>`
  color: ${(p) => (p.$isDarkMode ? "#8e8e93" : "#9ca3af")};
  font-size: 13px;
  font-weight: 500;
  margin-left: 6px;
  transition: color 0.3s ease;
`;

export const Label = styled.span<{ $isDarkMode: boolean }>`
  color: ${(p) => (p.$isDarkMode ? "#9da3ae" : "#6b7280")};
  transition: color 0.3s ease;
`;

export const Value = styled.span<{ $isDarkMode: boolean }>`
  color: ${(p) => (p.$isDarkMode ? "#ffffff" : "#1a1a1f")};
  font-weight: 800;
  font-size: 18px;
  transition: color 0.3s ease;
`;

export const Hint = styled.p<{ $isDarkMode: boolean }>`
  color: ${(p) => (p.$isDarkMode ? "#6b7280" : "#9ca3af")};
  margin: 8px 0;
  transition: color 0.3s ease;
  justi
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

export const SegmentedControl = styled.div<{ $isDarkMode: boolean }>`
  display: flex;
  background: ${(p) => p.$isDarkMode ? "#1c1c1e" : "#f3f4f6"};
  border-radius: 12px;
  padding: 4px;
  margin-top: 24px;
  margin-bottom: 16px;
  position: relative;
`;

export const SegmentBtn = styled.button<{ $active?: boolean; $isDarkMode: boolean }>`
  flex: 1;
  position: relative;
  border: 0;
  background: ${(p) => p.$active ? (p.$isDarkMode ? "#2c2c2e" : "#ffffff") : "transparent"};
  color: ${(p) => p.$active ? (p.$isDarkMode ? "#ffffff" : "#111827") : (p.$isDarkMode ? "#9ca3af" : "#6b7280")};
  font-weight: 600;
  font-size: 14px;
  padding: 8px 0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${(p) => p.$active ? (p.$isDarkMode ? "0 2px 8px rgba(0,0,0,0.4)" : "0 2px 8px rgba(0,0,0,0.1)") : "none"};
  
  &:focus-visible {
    outline: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 15%;
    right: 15%;
    height: 3px;
    border-radius: 3px;
    background: linear-gradient(90deg, #ec4899 0%, rgb(188, 75, 228) 50%, rgba(99, 102, 241, 0.67) 100%);
    opacity: ${(p) => p.$active ? 1 : 0};
    transform: ${(p) => p.$active ? "translateY(0)" : "translateY(-4px)"};
    transition: all 0.3s ease;
  }
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
  display: flex;
  justify-content: space-between;
  margin: 4px 0 12px;
`;

export const NutrientColumn = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ColorBar = styled.div<{ $color: string }>`
  width: 3px;
  height: 38px;
  background-color: ${(p) => p.$color};
  border-radius: 3px;
`;

export const NutrientInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
`;

export const NutrientLabel = styled.div<{ $isDarkMode: boolean }>`
  font-size: 13px;
  color: ${(p) => (p.$isDarkMode ? "#8e8e93" : "#6b7280")};
  line-height: 1.2;
`;

export const NutrientValue = styled.div<{ $isDarkMode: boolean }>`
  font-size: 15px;
  font-weight: 800;
  color: ${(p) => (p.$isDarkMode ? "#ffffff" : "#1a1a1f")};
  line-height: 1.2;
`;
