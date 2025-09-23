import styled from "styled-components";

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

export const SearchInput = styled.input`
  flex: 1 1 auto; /* prend tout l’espace dispo */
  min-width: 0; /* important pour éviter le débordement */
  height: 48px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid #262631;
  background-color: rgb(70, 70, 74);
  color: #f5f5f7;
  font-size: 16px;
  &::placeholder {
    font-size: 16px;
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
export const ScanIconBtnLeft = styled.button`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border: 0;
  background: transparent;
  color: #c7c7d1;
  display: grid;
  place-items: center;
  line-height: 0;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;

  &:hover,
  &:focus-visible {
    color: #e6e6eb;
    outline: none;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const Button = styled.button`
  height: 48px;
  padding: 0 18px;
  border-radius: 12px;
  border: 0;
  background-color: #4f46e5;
  color: white;
  font-weight: 700;
  cursor: pointer;
  display: grid;
  place-items: center;
  flex: 0 0 auto; /* ne grandit pas en flex */
  justify-self: start; /* si parent = grid */
  align-self: flex-start; /* si parent = flex */
  white-space: nowrap; /* évite le retour à la ligne */
`;

export const Card = styled.div`
  margin-top: 12px;
  padding: 16px;
  border-radius: 16px;
  background-color: #13131a;
  display: grid;
  gap: 8px;
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

export const ProductName = styled.div`
  color: #c7c7d1;
  font-size: 16px;
  font-weight: 600;
`;

export const InlineHint = styled.span`
  color: #6b7280;
  font-size: 12px;
  margin-left: 6px;
`;

export const Label = styled.span`
  color: #9da3ae;
`;

export const Value = styled.span`
  color: #e6e6eb;
  font-weight: 700;
`;

export const Hint = styled.p`
  color: #6b7280;
  margin: 8px 0;
`;

export const Heart = styled.span<{ $active?: boolean }>`
  color: ${(p) => (p.$active ? "#ec4899" : "#e6e6eb")};
  font-weight: 700;
  font-size: 18px;
  cursor: pointer;
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

export const InnerTabBar = styled.div`
  position: relative;
  display: flex;
  gap: 24px;
  border-bottom: 1px solid #262631;
  margin-top: 16px;
`;

export const InnerTabBtn = styled.button<{ $active?: boolean }>`
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
export const ClearBtn = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  height: 28px;
  min-width: 28px;
  padding: 0;
  border: 0;
  border-radius: 14px;
  background: #262631;
  color: #c7c7d1;
  cursor: pointer;
  display: grid;
  place-items: center;
  line-height: 1;
  font-size: 16px;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
`;
