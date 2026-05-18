import styled from "styled-components";

export const Wrap = styled.div`
  display: grid;
  gap: 18px;
  max-width: 100%;
`;

export const Title = styled.h3<{ $isDarkMode: boolean }>`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: ${(p) => (p.$isDarkMode ? "#f8fafc" : "#111827")};
  transition: color 0.3s ease;
`;

export const Section = styled.div<{ $isDarkMode: boolean }>`
  border-radius: 22px;
  padding: 22px;
  background: ${(p) => (p.$isDarkMode ? "rgba(18, 18, 18, 0.84)" : "#ffffff")};
  border: 1px solid
    ${(p) => (p.$isDarkMode ? "rgba(255,255,255,0.12)" : "#e5e7eb")};
  box-shadow: ${(p) =>
    p.$isDarkMode
      ? "0 12px 40px rgba(0,0,0,0.25)"
      : "0 12px 40px rgba(15,23,42,0.08)"};
`;

export const Form = styled.form`
  display: grid;
  gap: 24px;
`;

export const FormHeader = styled.div`
  display: grid;
  gap: 10px;
`;

export const Subtitle = styled.p<{ $isDarkMode: boolean }>`
  margin: 0;
  color: ${(p) => (p.$isDarkMode ? "#94a3b8" : "#6b7280")};
  font-size: 14px;
  line-height: 1.7;
  max-width: 680px;
`;

export const FormLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(280px, 1fr) minmax(320px, 380px);
  gap: 22px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const SummaryPanel = styled.div<{ $isDarkMode: boolean }>`
  display: grid;
  gap: 16px;
  min-height: 100%;
  padding: 20px;
  border-radius: 24px;
  background: ${(p) => (p.$isDarkMode ? "rgba(255,255,255,0.05)" : "#fafafc")};
  border: 1px solid
    ${(p) => (p.$isDarkMode ? "rgba(255,255,255,0.1)" : "#e5e7eb")};
`;

export const ResultEmpty = styled.div<{ $isDarkMode: boolean }>`
  color: ${(p) => (p.$isDarkMode ? "#cbd5e1" : "#6b7280")};
  font-size: 14px;
  line-height: 1.7;
`;

export const Field = styled.label<{ $isDarkMode: boolean }>`
  display: grid;
  gap: 8px;
  min-width: 0;
  width: 100%;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${(p) => (p.$isDarkMode ? "#cbd5e1" : "#6b7280")};
`;

export const Control = styled.div`
  display: grid;
  gap: 8px;
`;

export const ToggleGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
`;

const inputBase = `
  width: 100%;
  min-width: 0;
  border-radius: 14px;
  border: 1px solid transparent;
  padding: 14px 16px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.25s ease, box-shadow 0.25s ease;
  appearance: none;
  outline: none;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.16);

  &::placeholder {
    color: rgba(203, 213, 225, 0.65);
  }
`;

export const GenderSwitch = styled.button<{
  $isDarkMode: boolean;
  $isFemme: boolean;
}>`
  ${inputBase}
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: center;
  min-height: 52px;
  padding: 6px;
  border-radius: 999px;
  background: ${(p) => (p.$isDarkMode ? "rgba(255,255,255,0.08)" : "#f8fafc")};
  border: 1px solid
    ${(p) => (p.$isDarkMode ? "rgba(255,255,255,0.12)" : "#d1d5db")};
  color: ${(p) => (p.$isDarkMode ? "#e2e8f0" : "#374151")};
  cursor: pointer;
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    top: 6px;
    left: ${(p) => (p.$isFemme ? "calc(50% + 6px)" : "6px")};
    width: calc(50% - 12px);
    height: calc(100% - 12px);
    border-radius: 999px;
    background: ${(p) =>
      p.$isFemme
        ? "rgba(139, 92, 246, 0.9)"
        : p.$isDarkMode
          ? "rgba(139, 92, 246, 0.9)"
          : "rgba(139, 92, 246, 0.9)"};
    transition:
      left 0.2s ease,
      background 0.2s ease;
  }

  > span {
    position: relative;
    z-index: 1;
    text-align: center;
    font-weight: 700;
    line-height: 1;
  }

  > span:first-child {
    color: ${(p) =>
      p.$isFemme ? (p.$isDarkMode ? "#cbd5e1" : "#9ca3af") : "#ffffff"};
  }

  > span:last-child {
    color: ${(p) =>
      p.$isFemme ? "#ffffff" : p.$isDarkMode ? "#cbd5e1" : "#9ca3af"};
  }

  &:focus {
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.14);
  }
`;

export const ToggleButton = styled.button<{
  $isActive: boolean;
  $isDarkMode: boolean;
}>`
  ${inputBase}
  width: 100%;
  min-height: 52px;
  height: 52px;
  line-height: 20px;
  box-sizing: border-box;
  background: ${(p) =>
    p.$isActive
      ? p.$isDarkMode
        ? "rgba(139, 92, 246, 0.18)"
        : "rgba(99, 102, 241, 0.12)"
      : p.$isDarkMode
        ? "rgba(255,255,255,0.05)"
        : "#f8fafc"};
  color: ${(p) => (p.$isDarkMode ? "#f8fafc" : "#111827")};
  border-color: ${(p) =>
    p.$isActive
      ? "rgba(139, 92, 246, 0.7)"
      : p.$isDarkMode
        ? "rgba(255,255,255,0.1)"
        : "#d1d5db"};
  font-weight: 700;
  cursor: pointer;

  &:hover {
    filter: brightness(1.05);
  }

  &:focus {
    border-color: ${(p) => (p.$isDarkMode ? "#8b5cf6" : "#6366f1")};
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.14);
  }
`;

export const Input = styled.input<{ $isDarkMode: boolean }>`
  ${inputBase}
  min-height: 52px;
  height: 52px;
  line-height: 20px;
  box-sizing: border-box;
  background: ${(p) =>
    p.$isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(248,250,252,0.9)"};
  color: ${(p) => (p.$isDarkMode ? "#f8fafc" : "#111827")};
  border-color: ${(p) =>
    p.$isDarkMode ? "rgba(255,255,255,0.16)" : "#d1d5db"};

  &:focus {
    border-color: ${(p) => (p.$isDarkMode ? "#8b5cf6" : "#6366f1")};
    box-shadow: 0 0 0 4px
      ${(p) =>
        p.$isDarkMode ? "rgba(99,102,241,0.14)" : "rgba(99,102,241,0.14)"};
  }
`;

export const Select = styled.select<{ $isDarkMode: boolean }>`
  ${inputBase}
  min-height: 52px;
  height: 52px;
  line-height: 20px;
  box-sizing: border-box;
  background: ${(p) =>
    p.$isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(248,250,252,0.9)"};
  color: ${(p) => (p.$isDarkMode ? "#f8fafc" : "#111827")};
  border-color: ${(p) =>
    p.$isDarkMode ? "rgba(255,255,255,0.16)" : "#d1d5db"};

  &:focus {
    border-color: ${(p) => (p.$isDarkMode ? "#8b5cf6" : "#6366f1")};
    box-shadow: 0 0 0 4px
      ${(p) =>
        p.$isDarkMode ? "rgba(99,102,241,0.14)" : "rgba(99,102,241,0.14)"};
  }
`;

export const Button = styled.button<{ $isDarkMode: boolean }>`
  margin-top: 18px;
  width: fit-content;
  padding: 14px 22px;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  box-shadow: 0 18px 36px rgba(139, 92, 246, 0.24);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    filter: saturate(1.05);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ResultCard = styled.div<{ $isDarkMode: boolean }>`
  border-radius: 22px;
  padding: 20px;
  display: grid;
  gap: 12px;
  background: ${(p) => (p.$isDarkMode ? "rgba(255,255,255,0.08)" : "#f8fafc")};
  border: 1px solid
    ${(p) => (p.$isDarkMode ? "rgba(255,255,255,0.18)" : "#e5e7eb")};
  color: ${(p) => (p.$isDarkMode ? "#e6e6eb" : "#111827")};
`;

export const ResultTitle = styled.h4<{ $isDarkMode: boolean }>`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: ${(p) => (p.$isDarkMode ? "#ffffff" : "#111827")};
`;

export const ResultRow = styled.div<{ $isDarkMode: boolean }>`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 14px;
  color: ${(p) => (p.$isDarkMode ? "#e6e6eb" : "#111827")};

  strong {
    color: ${(p) => (p.$isDarkMode ? "#ffffff" : "#111827")};
  }
`;

export const ResultLabel = styled.div<{ $isDarkMode: boolean }>`
  display: grid;
  gap: 4px;
  min-width: 0;

  span {
    font-weight: 600;
  }

  small {
    display: block;
    font-size: 12px;
    line-height: 1.4;
    color: ${(p) => (p.$isDarkMode ? "#94a3b8" : "#6b7280")};
  }
`;

export const Note = styled.div<{ $isDarkMode: boolean }>`
  color: ${(p) => (p.$isDarkMode ? "#94a3b8" : "#4b5563")};
  font-size: 13px;
  line-height: 1.5;
`;

export const FieldGrid = styled.div`
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;
