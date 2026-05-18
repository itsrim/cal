import React, { useRef, useState } from "react";
import { useCalorieCalculator } from "./useCalorieCalculator";
import { useI18n } from "../../contexts/I18nContext";
import {
  Wrap,
  Title,
  Section,
  Form,
  FormHeader,
  Subtitle,
  FormLayout,
  SummaryPanel,
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
  ResultEmpty,
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
  const { t } = useI18n();
  const { resultat, calculer } = useCalorieCalculator();
  const resultRef = useRef<HTMLDivElement | null>(null);
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
    setMessage(
      `${t("calculator.objectiveSaved")} : ${result.caloriesCible} kcal/${t(
        "calculator.perDay",
      )}`,
    );

    requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    });
  }

  return (
    <Wrap>
      <Section $isDarkMode={isDarkMode}>
        <Form onSubmit={handleSubmit}>
          <FormHeader>
            {/* <Title $isDarkMode={isDarkMode}>{t("calculator.title")}</Title> */}
            <Subtitle $isDarkMode={isDarkMode}>
              {t("calculator.description")}
            </Subtitle>
          </FormHeader>

          <FormLayout>
            <div>
              <FieldGrid>
                <Field $isDarkMode={isDarkMode}>
                  {t("calculator.gender")}
                  <GenderSwitch
                    type="button"
                    $isDarkMode={isDarkMode}
                    $isFemme={form.sexe === "femme"}
                    aria-pressed={form.sexe === "femme"}
                    onClick={() =>
                      toggleSexe(form.sexe === "homme" ? "femme" : "homme")
                    }
                  >
                    <span>{t("calculator.man")}</span>
                    <span>{t("calculator.woman")}</span>
                  </GenderSwitch>
                </Field>

                <Field $isDarkMode={isDarkMode}>
                  {t("calculator.activityFactor")}
                  <Select
                    name="facteurActivite"
                    value={form.facteurActivite}
                    onChange={handleChange}
                    $isDarkMode={isDarkMode}
                  >
                    <option value="1.2">
                      {t("calculator.activity.sedentary")}
                    </option>
                    <option value="1.375">
                      {t("calculator.activity.light")}
                    </option>
                    <option value="1.55">
                      {t("calculator.activity.moderate")}
                    </option>
                    <option value="1.725">
                      {t("calculator.activity.active")}
                    </option>
                    <option value="1.9">
                      {t("calculator.activity.veryActive")}
                    </option>
                  </Select>
                </Field>

                <Field $isDarkMode={isDarkMode}>
                  {t("calculator.age")}
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
                  {t("calculator.height")}
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
                  {t("calculator.currentWeight")}
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
                  {t("calculator.targetWeight")}
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
                  {t("calculator.duration")}
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
                {t("calculator.submit")}
              </Button>
            </div>

            <SummaryPanel $isDarkMode={isDarkMode}>
              <ResultTitle $isDarkMode={isDarkMode}>
                {t("calculator.results")}
              </ResultTitle>
              {resultat ? (
                <ResultCard ref={resultRef} $isDarkMode={isDarkMode}>
                  <ResultRow $isDarkMode={isDarkMode}>
                    <ResultLabel $isDarkMode={isDarkMode}>
                      <span>{t("calculator.bmr")}</span>
                      <small>{t("calculator.bmrDescription")}</small>
                    </ResultLabel>
                    <strong>{resultat.BMR} kcal</strong>
                  </ResultRow>
                  <ResultRow $isDarkMode={isDarkMode}>
                    <ResultLabel $isDarkMode={isDarkMode}>
                      <span>{t("calculator.tdee")}</span>
                      <small>{t("calculator.tdeeDescription")}</small>
                    </ResultLabel>
                    <strong>{resultat.TDEE} kcal</strong>
                  </ResultRow>
                  <ResultRow $isDarkMode={isDarkMode}>
                    <span>{t("calculator.dailyDeficit")}</span>
                    <strong>{resultat.deficitJour} kcal</strong>
                  </ResultRow>
                  <ResultRow $isDarkMode={isDarkMode}>
                    <span>{t("calculator.caloriesPerDay")}</span>
                    <strong>
                      {resultat.caloriesCible} kcal/{t("calculator.perDay")}
                    </strong>
                  </ResultRow>
                  {message ? (
                    <Note $isDarkMode={isDarkMode}>{message}</Note>
                  ) : null}
                </ResultCard>
              ) : (
                <ResultEmpty $isDarkMode={isDarkMode}>
                  {t("calculator.emptyState")}
                </ResultEmpty>
              )}
            </SummaryPanel>
          </FormLayout>
        </Form>
      </Section>
    </Wrap>
  );
}
