import React from "react";
import styled from "styled-components";

const NutriScoreContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: 8px;
`;

const NutriScoreSegment = styled.div<{ $grade: string; $active: boolean }>`
  width: 20px;
  height: 12px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  color: white;
  background-color: ${({ $grade, $active }) => {
    if (!$active) return "#666";
    switch ($grade) {
      case "A":
        return "#2E7D32"; // Vert foncé
      case "B":
        return "#4CAF50"; // Vert clair
      case "C":
        return "#FFC107"; // Jaune
      case "D":
        return "#FF9800"; // Orange
      case "E":
        return "#F44336"; // Rouge
      default:
        return "#666";
    }
  }};
  ${({ $active }) => $active && `
    transform: scale(1.1);
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  `}
`;

type NutriScoreProps = {
  grade?: string;
};

export const NutriScore: React.FC<NutriScoreProps> = ({ grade }) => {
  const grades = ["A", "B", "C", "D", "E"];
  
  if (!grade) {
    return null;
  }

  return (
    <NutriScoreContainer>
      {grades.map((g) => (
        <NutriScoreSegment
          key={g}
          $grade={g}
          $active={g === grade.toUpperCase()}
        >
          {g}
        </NutriScoreSegment>
      ))}
    </NutriScoreContainer>
  );
};
