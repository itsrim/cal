import React, { useState } from "react";
import { SavedItem } from "../../types";
import { storage } from "../../utils/storage";
import { useI18n } from "../../contexts/I18nContext";
import {
  Wrap,
  Header,
  Title,
  Right,
  Nav,
  IconBtn,
  TargetWrap,
  TargetInput,
  Legend,
  LegendBarWrap,
  Bar,
  Grid,
  WeekLabel,
  DayLabel,
  Cell,
  Slide,
  BarLabels,
} from "./StyleTrackingTab";

// /* ========== Helpers ========== */
import {
  startOfDay,
  monthStart,
  monthEnd,
  addMonths,
  startOfWeek,
  colorFor,
} from "../../utils/helpers";

/* ========== Component ========== */
type TrackingTabProps = { isDarkMode: boolean };

export const TrackingTab = ({ isDarkMode }: TrackingTabProps) => {
  const { t } = useI18n();
  /* objectif partagé (utilisé aussi par HistoryTab si tu lis la même clé) */
  const TARGET_KEY = "cal-target-kcal";
  // const [target, setTarget] = React.useState<number>(2000);
  const [target, setTarget] = useState<number>(() => {
    const saved = localStorage.getItem(TARGET_KEY);
    return saved ? parseInt(saved, 10) : 2000;
  });

  // // valeur numérique à utiliser partout
  // const targetKcal = React.useMemo(() => {
  //   const n = target;
  //   return Number.isFinite(n) ? Math.max(1, n) : 2000;
  // }, [target]);

  // // on persiste seulement quand la valeur numérique est valide
  // const persistIfValid = (s: string) => {
  //   const n = parseInt(s, 10);
  //   if (Number.isFinite(n)) {
  //     localStorage.setItem(TARGET_KEY, String(Math.max(1, n)));
  //   }
  // };

  React.useEffect(() => {
    localStorage.setItem(TARGET_KEY, String(target));
  }, [target]);

  /* lire l’historique (même clé que HistoryTab) */
  const [items, setItems] = React.useState<SavedItem[]>([]);
  React.useEffect(() => {
    const load = async () => {
      try {
        const raw = await storage.getItem("cal-history-v1");
        setItems(raw ? JSON.parse(raw) : []);
      } catch {
        setItems([]);
      }
    };
    load();
    const id = setInterval(load, 1000);
    return () => clearInterval(id);
  }, []);

  /* regrouper kcal/jour */
  const kcalByDay = React.useMemo(() => {
    const m = new Map<number, number>();
    for (const it of items) {
      const day = startOfDay(new Date(it.timestamp));
      const base =
        (it.nutriments as any)?.["energy-kcal_100g"] ??
        (it.nutriments as any)?.energy_kcal_100g ??
        0;
      const qty = it.quantity ?? 100;
      const k = typeof base === "number" ? (base * qty) / 100 : 0;
      m.set(day, (m.get(day) || 0) + k);
    }
    return m;
  }, [items]);

  /* pagination par mois + anim direction */
  const [monthCursor, setMonthCursor] = React.useState<Date>(
    monthStart(new Date())
  );
  const [animDir, setAnimDir] = React.useState<"next" | "prev">("next");

  const mStart = monthStart(monthCursor);
  const mEnd = monthEnd(monthCursor);

  const firstColStart = startOfWeek(mStart);
  const weeks: Date[] = [];
  for (
    let d = new Date(firstColStart);
    d <= mEnd;
    d = new Date(d.getTime() + 7 * 86400000)
  ) {
    weeks.push(new Date(d));
  }
  const colsCount = weeks.length;
  const weekdayNames = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];

  // gestures (mobile)
  const touch = React.useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.changedTouches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const goPrev = () => {
    setAnimDir("prev");
    setMonthCursor((d) => monthStart(addMonths(d, -1)));
  };
  const goNext = () => {
    setAnimDir("next");
    setMonthCursor((d) => monthStart(addMonths(d, 1)));
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touch.current.x;
    const dy = Math.abs(t.clientY - touch.current.y);
    touch.current = null;
    if (Math.abs(dx) > 60 && dy < 40) dx < 0 ? goNext() : goPrev();
  };

  const monthLabel = new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  }).format(mStart);

  return (
    <Wrap onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <Header $isDarkMode={isDarkMode}>
          <TargetWrap $isDarkMode={isDarkMode}>
            max
            <TargetInput
              $isDarkMode={isDarkMode}
              type="number"
              min={800}
              step={50}
              value={target}
              onChange={(e) => setTarget(parseInt(e.target.value, 10))}
              onBlur={(e) => {
                const n = parseInt(e.target.value, 10);
                if (!Number.isFinite(n)) {
                  setTarget(2000);
                } else if (n < 1) {
                  setTarget(1);
                } else {
                  setTarget(n);
                }
                if (Number.isFinite(n)) {
                  localStorage.setItem(TARGET_KEY, String(Math.max(1, n)));
                }
              }}
            />
            kcal
          </TargetWrap>
        <Right>
          <Title $isDarkMode={isDarkMode}>{monthLabel}</Title>
        
          <Nav>
          <IconBtn $isDarkMode={isDarkMode} aria-label={t('tracking.previousMonth')} onClick={goPrev}>
            ‹
          </IconBtn>
          <IconBtn $isDarkMode={isDarkMode} aria-label={t('tracking.nextMonth')} onClick={goNext}>
            ›
          </IconBtn>
        </Nav>
        </Right>
      </Header>

      <Legend $isDarkMode={isDarkMode}>
        <span>Objectif</span>
        <LegendBarWrap>
          <Bar />
          <BarLabels>
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </BarLabels>
        </LegendBarWrap>
      </Legend>

      <Slide $dir={animDir} key={mStart.toISOString()}>
        <Grid $cols={colsCount}>
          <div />
          {weeks.map((w) => {
            const dd = String(w.getDate()).padStart(2, "0");
            const mm = String(w.getMonth() + 1).padStart(2, "0");
            return (
              <WeekLabel key={w.toISOString()} $isDarkMode={isDarkMode}>
                {dd}/{mm}
              </WeekLabel>
            );
          })}

          {weekdayNames.map((label, row) => (
            <React.Fragment key={label}>
              <DayLabel $isDarkMode={isDarkMode}>{label}</DayLabel>
              {weeks.map((w) => {
                const day = new Date(w);
                day.setDate(day.getDate() + row);
                const inMonth = day.getMonth() === mStart.getMonth();
                const key = startOfDay(day);
                const kcal = Math.round(kcalByDay.get(key) || 0);
                const pct = Math.min(200, (kcal / Math.max(1, target)) * 100);
                const over = pct > 100;
                const bg = inMonth ? colorFor(pct, isDarkMode) : (isDarkMode ? "#121218" : "#f3f4f6");
                return (
                  <Cell
                    key={key + String(row)}
                    $bg={bg}
                    $over={over}
                    $isDarkMode={isDarkMode}
                    title={`${day.toLocaleDateString(
                      "fr-FR"
                    )} · ${kcal} kcal (${Math.round(pct)}%)`}
                  >
                    {kcal > 0 && inMonth ? kcal : ""}
                  </Cell>
                );
              })}
            </React.Fragment>
          ))}
        </Grid>
      </Slide>
    </Wrap>
  );
};
