import styled from "styled-components";

export const SubTitle = styled.h2`
  color: #e6e6eb;
  font-weight: 700;
  margin-top: 4px;
  margin-bottom: 4px;
  font-size: 16px;
  text-align: center;
`;

export const CalendarStrip = styled.div`
  height: 64px;
  overflow-x: auto;
  display: flex;
  gap: 10px;
  padding-bottom: 6px;
  scrollbar-width: thin;
`;

export const DayPill = styled.button<{ $selected?: boolean }>`
  height: 48px;
  width: 56px;
  min-width: 56px;
  border-radius: 12px;
  border: 1px solid grey;
  background-color: ${(p) => (p.$selected ? "#4f46e5" : "#13131a")};
  color: #e6e6eb;
  font-weight: 700;
  white-space: pre-line;
  display: grid;
  place-items: center;
  cursor: pointer;
`;

export const Card = styled.div`
  margin-top: 12px;
  padding: 16px;
  border-radius: 16px;
  background-color: #13131a;
  display: grid;
  gap: 8px;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
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

export const IconButton = styled.button`
  padding: 8px;
  margin-left: 8px;
  border: 0;
  background: transparent;
  cursor: pointer;
`;

export const QtyInput = styled.input`
  width: 72px;
  height: 36px;
  border-radius: 8px;
  background-color: rgb(70, 70, 74);
  color: #f5f5f7;
  text-align: center;
  border: 1px solid #262631;
  font-size: 16px;
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

export const LegendRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #9da3ae;
  font-weight: 600;
`;

export const Pct = styled.span<{ $over?: boolean }>`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${(p) => (p.$over ? "#ef4444" : "white")};
  font-weight: 800;
`;

export const Track = styled.div`
  height: 22px;
  border-radius: 11px;
  background: #23232b; /* rail */
  overflow: hidden;
  position: relative;
`;

export const Fill = styled.div<{ $pct: number; $color: string }>`
  width: ${(p) => Math.min(100, p.$pct)}%;
  height: 100%;
  background: ${(p) => p.$color};
  border-radius: 11px 0 0 11px;
  transition: width 0.25s ease;
`;

export const PctLeft = styled.span<{ $over?: boolean }>`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${(p) => (p.$over ? "#ef4444" : "white")};
  font-weight: 800;
  pointer-events: none;
`;

export const RightInfo = styled.div`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 10px;
  align-items: center;
  color: rgb(255, 255, 255);
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none; /* pas cliquable */
`;
