import { useState } from "react";

type UseCalorieCalculatorValues = {
  sexe: "homme" | "femme";
  age: number;
  poidsActuel: number;
  taille: number;
  poidsCible: number;
  dureeJours: number;
  facteurActivite: number;
};

export type CalorieResult = {
  BMR: number;
  TDEE: number;
  deficitJour: number;
  caloriesCible: number;
};

const TARGET_KEY = "cal-target-kcal";

const clampCalories = (value: number) => Math.max(1200, Math.round(value));

export function useCalorieCalculator() {
  const [resultat, setResultat] = useState<CalorieResult | null>(null);

  const calculer = (values: UseCalorieCalculatorValues) => {
    const bmr =
      values.sexe === "homme"
        ? 10 * values.poidsActuel + 6.25 * values.taille - 5 * values.age + 5
        : 10 * values.poidsActuel + 6.25 * values.taille - 5 * values.age - 161;

    const TDEE = bmr * values.facteurActivite;
    const totalDelta = (values.poidsCible - values.poidsActuel) * 7700;
    const deficitJour = totalDelta / Math.max(1, values.dureeJours);
    const caloriesCible = clampCalories(TDEE + deficitJour);

    const nextResult = {
      BMR: Math.round(bmr),
      TDEE: Math.round(TDEE),
      deficitJour: Math.round(deficitJour),
      caloriesCible,
    };

    setResultat(nextResult);
    try {
      localStorage.setItem(TARGET_KEY, String(caloriesCible));
    } catch {
      // ignore storage errors
    }

    return nextResult;
  };

  return { resultat, calculer };
}
