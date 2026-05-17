import React, { useState } from "react";
import { useCalorieCalculator } from "./useCalorieCalculator";
import {
  Wrap,
  Title,
  Section,
  Form,
  Field,
  FieldGrid,
  Input,
  Select,
  GenderSwitch,
  Button,
  ResultCard,
  ResultTitle,
  ResultRow,
  ResultLabel,
  Note,
} from "./StyleCalorieForm";

type CalorieFormState = {
  sexe: "homme" | "femme";
  age: number | string;
  poidsActuel: number | string;
  taille: number | string;
  poidsCible: number | string;
  dureeJours: number | string;
  facteurActivite: number | string;
};

const initialForm: CalorieFormState = {
  sexe: "femme",
  age: 30,
  poidsActuel: 70,
  taille: 165,
  poidsCible: 60,
  dureeJours: 90,
  facteurActivite: 1.55,
};

export default function CalorieForm({ isDarkMode }: { isDarkMode: boolean }) {
  const { resultat, calculer } = useCalorieCalculator();
  const [form, setForm] = useState<CalorieFormState>(initialForm);
  const [message, setMessage] = useState<string>("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function toggleSexe(value: "homme" | "femme") {
    setForm((current) => ({ ...current, sexe: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const values = {
      sexe: form.sexe,
      age: Number(form.age),
      poidsActuel: Number(form.poidsActuel),
      taille: Number(form.taille),
      poidsCible: Number(form.poidsCible),
      dureeJours: Number(form.dureeJours),
      facteurActivite: Number(form.facteurActivite),
    };

    const result = calculer(values);
    setMessage(`Objectif enregistré : ${result.caloriesCible} kcal/jour`);
  }

  return (
    <Wrap>
      {/* <Title $isDarkMode={isDarkMode}>Calculateur de calories</Title> */}
      <Section $isDarkMode={isDarkMode}>
        <Form onSubmit={handleSubmit}>
          <FieldGrid>
            <Field $isDarkMode={isDarkMode}>
              Sexe
              <GenderSwitch
                type="button"
                $isDarkMode={isDarkMode}
                $isFemme={form.sexe === "femme"}
                aria-pressed={form.sexe === "femme"}
                onClick={() =>
                  toggleSexe(form.sexe === "homme" ? "femme" : "homme")
                }
              >
                <span>Homme</span>
                <span>Femme</span>
              </GenderSwitch>
            </Field>

            <Field $isDarkMode={isDarkMode}>
              Facteur d'activité
              <Select
                name="facteurActivite"
                value={form.facteurActivite}
                onChange={handleChange}
                $isDarkMode={isDarkMode}
              >
                <option value="1.2">Sédentaire</option>
                <option value="1.375">Léger</option>
                <option value="1.55">Modéré</option>
                <option value="1.725">Élevé</option>
                <option value="1.9">Très élevé</option>
              </Select>
            </Field>

            <Field $isDarkMode={isDarkMode}>
              Âge
              <Input
                type="number"
                name="age"
                min={10}
                value={form.age}
                onChange={handleChange}
                $isDarkMode={isDarkMode}
              />
            </Field>

            <Field $isDarkMode={isDarkMode}>
              Taille (cm)
              <Input
                type="number"
                name="taille"
                min={100}
                value={form.taille}
                onChange={handleChange}
                $isDarkMode={isDarkMode}
              />
            </Field>

            <Field $isDarkMode={isDarkMode}>
              Poids actuel (kg)
              <Input
                type="number"
                name="poidsActuel"
                min={30}
                value={form.poidsActuel}
                onChange={handleChange}
                $isDarkMode={isDarkMode}
              />
            </Field>

            <Field $isDarkMode={isDarkMode}>
              Poids cible (kg)
              <Input
                type="number"
                name="poidsCible"
                min={30}
                value={form.poidsCible}
                onChange={handleChange}
                $isDarkMode={isDarkMode}
              />
            </Field>

            <Field $isDarkMode={isDarkMode}>
              Durée (jours)
              <Input
                type="number"
                name="dureeJours"
                min={14}
                value={form.dureeJours}
                onChange={handleChange}
                $isDarkMode={isDarkMode}
              />
            </Field>
          </FieldGrid>

          <Button type="submit" $isDarkMode={isDarkMode}>
            Calculer et enregistrer
          </Button>

          {resultat && (
            <ResultCard $isDarkMode={isDarkMode}>
              <ResultTitle $isDarkMode={isDarkMode}>Résultats</ResultTitle>
              <ResultRow $isDarkMode={isDarkMode}>
                <ResultLabel $isDarkMode={isDarkMode}>
                  <span>BMR</span>
                  <small>Métabolisme de base</small>
                </ResultLabel>
                <strong>{resultat.BMR} kcal</strong>
              </ResultRow>
              <ResultRow $isDarkMode={isDarkMode}>
                <ResultLabel $isDarkMode={isDarkMode}>
                  <span>TDEE</span>
                  <small>Dépense énergétique journalière</small>
                </ResultLabel>
                <strong>{resultat.TDEE} kcal</strong>
              </ResultRow>
              <ResultRow $isDarkMode={isDarkMode}>
                <span>Déficit/jour</span>
                <strong>{resultat.deficitJour} kcal</strong>
              </ResultRow>
              <ResultRow $isDarkMode={isDarkMode}>
                <span>Calories max / jour</span>
                <strong>{resultat.caloriesCible} kcal/jour</strong>
              </ResultRow>
              {message ? <Note $isDarkMode={isDarkMode}>{message}</Note> : null}
            </ResultCard>
          )}
        </Form>

        <Note $isDarkMode={isDarkMode}>
          Ce calculateur génère un objectif journalier, puis l'enregistre
          automatiquement pour le suivi.
        </Note>
      </Section>
    </Wrap>
  );
}
