import styled, { css, keyframes } from "styled-components";

/* ========== Styles ========== */
export const Wrap = styled.div`
  display: grid;
  gap: 12px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #e6e6eb;
  gap: 10px;
  flex-wrap: wrap;
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
`;

export const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Nav = styled.div`
  display: flex;
  gap: 8px;
`;

export const IconBtn = styled.button`
  border: 0;
  background: #1a1a22;
  color: #e6e6eb;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  cursor: pointer;
`;

export const TargetWrap = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #9da3ae;
  font-size: 12px;
`;
export const TargetInput = styled.input`
  width: 86px;
  height: 32px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid #262631;
  background-color: rgb(70, 70, 74);
  color: #e6e6eb;
`;

export const Legend = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  color: #9da3ae;
  font-size: 14px;
  flex-wrap: wrap;
`;

/* conteneur pour la barre + labels */
export const LegendBarWrap = styled.div`
  position: relative;
  flex: 1 1 140px;
  min-width: 160px;
`;

/* la barre dégradée */
export const Bar = styled.div`
  height: 16px;
  border-radius: 999px;
  background: linear-gradient(90deg, #8b5cf6 0%, #ec4899 55%, #ef4444 100%);
`;

/* labels superposés dans la barre */
export const BarLabels = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 6px;
  font-size: 10px;
  color: #e5e7eb;
  pointer-events: none;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
`;

export const Grid = styled.div<{ $cols: number }>`
  display: grid;
  grid-template-columns: 56px repeat(${(p) => p.$cols}, minmax(28px, 1fr));
  gap: 6px;
`;

export const WeekLabel = styled.div`
  color: #6b7280;
  font-size: 11px;
  text-align: center;
`;

export const DayLabel = styled.div`
  color: #9da3ae;
  font-size: 12px;
  line-height: 28px;
  height: 28px;
`;

export const Cell = styled.button<{ $bg: string; $over?: boolean }>`
  height: 28px;
  border-radius: 6px;
  border: 0;
  background: ${(p) => p.$bg};
  color: ${(p) => (p.$over ? "#fff" : "#e6e6eb")};
  font-size: 11px;
  cursor: default;
  display: grid;
  place-items: center;
  opacity: 0.98;
`;

/* Slide anim */
export const slideInLeft = keyframes`
  from { opacity: .3; transform: translateX(20px); }
  to   { opacity: 1;  transform: translateX(0); }
`;
export const slideInRight = keyframes`
  from { opacity: .3; transform: translateX(-20px); }
  to   { opacity: 1;  transform: translateX(0); }
`;
export const Slide = styled.div<{ $dir: "next" | "prev" }>`
  animation: ${(p) =>
    p.$dir === "next"
      ? css`
          ${slideInLeft} .28s ease
        `
      : css`
          ${slideInRight} .28s ease
        `};
`;
