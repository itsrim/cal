import React from "react";
import styled from "styled-components";

const COLORS: Record<string, string> = {
  A: "#2E7D32",
  B: "#7BC043",
  C: "#F9E14B",
  D: "#FFB000",
  E: "#E53935",
};

const NutriScoreContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0; /* pas d'espace, on gère le chevauchement via margin */
  overflow: visible; /* pour laisser dépasser la "pilule" active */
`;

const NutriScoreSegment = styled.div<{
  $grade: string;
  $active: boolean;
  $first?: boolean;
  $last?: boolean;
}>`
  position: relative;
  min-width: 20px;
  height: ${({ $active }) => ($active ? "14px" : "12px")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: ${({ $active }) => ($active ? "white" : "grey")};
  font-size: ${({ $active }) => ($active ? "13px" : "11px")};
  background: ${({ $grade }) => COLORS[$grade] ?? "#666"};
  opacity: ${({ $active }) => ($active ? 1 : 0.9)};
  border-radius: ${({ $first, $last, $active }) =>
    $active
      ? "999px" /* pilule bien ronde quand active */
      : $first
      ? "8px 0 0 8px"
      : $last
      ? "0 8px 8px 0"
      : "0"};

  /* mettre l'actif au-dessus pour bien chevaucher */
  z-index: ${({ $active }) => ($active ? 2 : 1)};
  box-shadow: ${({ $active }) =>
    $active ? "0 2px 5px rgba(0,0,0,0.25)" : "none"};
  transition: height 140ms ease, font-size 140ms ease, opacity 140ms ease,
    box-shadow 140ms ease, border-radius 140ms ease;

  /* Halo clair elliptique pour rappeler la maquette */
  &::before {
    content: "";
    position: absolute;
    inset: ${({ $active }) => ($active ? "-2px -4px" : "0")};
    border-radius: 999px;
    background: ${({ $active, $grade }) =>
      $active ? COLORS[$grade] : "transparent"};
    z-index: -1;
    pointer-events: none;
  }

  /* corrige le chevauchement du tout premier */
  &:first-child {
    margin-left: 0;
  }
`;

type NutriScoreProps = {
  grade?: string;
};

export const NutriScore: React.FC<NutriScoreProps> = ({ grade }) => {
  const grades = ["A", "B", "C", "D", "E"];
  if (!grade) return null;

  const upper = grade.toUpperCase();

  return (
    <NutriScoreContainer>
      {grades.map((g, i) => (
        <NutriScoreSegment
          key={g}
          $grade={g}
          $active={g === upper}
          $first={i === 0}
          $last={i === grades.length - 1}
        >
          {g}
        </NutriScoreSegment>
      ))}
    </NutriScoreContainer>
  );
};
