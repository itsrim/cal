import styled from "styled-components";

export const ListScroll = styled.div`
  flex: 1;
  min-height: 0; /* ← autorise le scroll quand il y a des éléments */
  overflow-y: auto;
  padding-right: 4px;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const SearchInput = styled.input`
  flex: 1 1 260px;
  height: 48px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid #262631;
  background-color: #1a1a22;
  color: #f5f5f7;
  font-size: 16px;
  &::placeholder {
    font-size: 16px;
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
// styles locaux
export const InputWrap = styled.div`
  position: relative;
  flex: 1 1 260px;
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

  &:hover, &:focus-visible { color: #e6e6eb; outline: none; }
`;
