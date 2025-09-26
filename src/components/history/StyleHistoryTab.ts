import styled from "styled-components";

export const SubTitle = styled.h2<{ $isDarkMode: boolean }>`
  color: ${(p) => (p.$isDarkMode ? "#e6e6eb" : "#1a1a1f")};
  font-weight: 700;
  margin-top: 4px;
  margin-bottom: 4px;
  font-size: 16px;
  text-align: center;
  transition: color 0.3s ease;
`;

export const CalendarStrip = styled.div`
  height: 64px;
  overflow-x: auto;
  display: flex;
  gap: 10px;
  padding-bottom: 6px;
  scrollbar-width: thin;
`;

export const DayPill = styled.button<{ $selected?: boolean; $isDarkMode: boolean }>`
  height: 48px;
  width: 56px;
  min-width: 56px;
  border-radius: 12px;
  border: 1px solid ${(p) => (p.$isDarkMode ? "grey" : "#e5e7eb")};
  background-color: ${(p) => (p.$selected ? "#4f46e5" : (p.$isDarkMode ? "#13131a" : "#f9fafb"))};
  color: ${(p) => (p.$isDarkMode ? "#e6e6eb" : "#1a1a1f")};
  font-weight: 700;
  white-space: pre-line;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
`;

export const Card = styled.div<{ $isDarkMode: boolean }>`
  margin-top: 12px;
  padding: 16px;
  border-radius: 16px;
  background-color: ${(p) => (p.$isDarkMode ? "#13131a" : "#f9fafb")};
  display: grid;
  gap: 8px;
  transition: background-color 0.3s ease;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const ProductName = styled.div<{ $isDarkMode: boolean }>`
  color: ${(p) => (p.$isDarkMode ? "#c7c7d1" : "#1a1a1f")};
  font-size: 16px;
  font-weight: 600;
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
  font-size: 18px;
  transition: color 0.3s ease;
`;

export const Hint = styled.p<{ $isDarkMode: boolean }>`
  color: ${(p) => (p.$isDarkMode ? "#6b7280" : "#9ca3af")};
  margin: 8px 0;
  transition: color 0.3s ease;
`;

export const IconButton = styled.button`
  padding: 8px;
  margin-left: 8px;
  border: 0;
  background: transparent;
  cursor: pointer;
`;

export const QtyInput = styled.input<{ $isDarkMode: boolean }>`
  width: 72px;
  height: 30px;
  border-radius: 8px;
  background-color: ${(p) => (p.$isDarkMode ? "rgb(70, 70, 74)" : "#ffffff")};
  color: ${(p) => (p.$isDarkMode ? "#f5f5f7" : "#1a1a1f")};
  text-align: center;
  border: 1px solid ${(p) => (p.$isDarkMode ? "#262631" : "#e5e7eb")};
  font-size: 16px;
  transition: all 0.3s ease;
`;

export const LeftRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Trash = styled.span`
  color: #ef4444;
  font-weight: 900;
  font-size: 16px;
`;

export const ListScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 260px);
  padding-right: 4px;
`;
// ----- Progress bars -----
export const ProgressWrap = styled.div`
  display: grid;
  gap: 10px;
  margin: 8px 0 16px;
`;

export const LegendRow = styled.div<{ $isDarkMode: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${(p) => (p.$isDarkMode ? "#9da3ae" : "#6b7280")};
  font-weight: 600;
  transition: color 0.3s ease;
`;

export const Pct = styled.span<{ $over?: boolean }>`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${(p) => (p.$over ? "#ef4444" : "white")};
  font-weight: 800;
`;

export const Track = styled.div<{ $isDarkMode: boolean }>`
  height: 22px;
  border-radius: 11px;
  background: ${(p) => (p.$isDarkMode ? "#23232b" : "#e5e7eb")}; /* rail */
  overflow: hidden;
  position: relative;
  transition: background-color 0.3s ease;
`;

export const Fill = styled.div<{ $pct: number; $color: string }>`
  width: ${(p) => Math.min(100, p.$pct)}%;
  height: 100%;
  background: ${(p) => p.$color};
  border-radius: 11px 0 0 11px;
  transition: width 0.25s ease;
`;

export const PctLeft = styled.span<{ $over?: boolean; $isDarkMode: boolean }>`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${(p) => (p.$over ? "#ef4444" : (p.$isDarkMode ? "white" : "#1a1a1f"))};
  font-weight: 800;
  pointer-events: none;
  transition: color 0.3s ease;
`;

export const RightInfo = styled.div<{ $isDarkMode: boolean }>`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 10px;
  align-items: center;
  color: ${(p) => (p.$isDarkMode ? "rgb(255, 255, 255)" : "#1a1a1f")};
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none; /* pas cliquable */
  transition: color 0.3s ease;
`;
