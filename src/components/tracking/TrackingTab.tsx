import React from "react";
import styled, { css, keyframes } from "styled-components";
import { SavedItem } from "../../types";
import { storage } from "../../utils/storage";

/* ========== Styles ========== */
const Wrap = styled.div`
  display: grid;
  gap: 12px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #e6e6eb;
  gap: 10px;
  flex-wrap: wrap;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Nav = styled.div`
  display: flex;
  gap: 8px;
`;

const IconBtn = styled.button`
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

const TargetWrap = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #9da3ae;
  font-size: 12px;
`;
const TargetInput = styled.input`
  width: 86px;
  height: 32px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid #262631;
  background: #15151b;
  color: #e6e6eb;
`;

const Legend = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  color: #9da3ae;
  font-size: 14px;
  flex-wrap: wrap;
`;

/* conteneur pour la barre + labels */
const LegendBarWrap = styled.div`
  position: relative;
  flex: 1 1 140px;
  min-width: 160px;
`;

/* la barre dégradée */
const Bar = styled.div`
  height: 16px;
  border-radius: 999px;
  background: linear-gradient(90deg, #8b5cf6 0%, #ec4899 55%, #ef4444 100%);
`;

/* labels superposés dans la barre */
const BarLabels = styled.div`
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

const Grid = styled.div<{ $cols: number }>`
  display: grid;
  grid-template-columns: 56px repeat(${(p) => p.$cols}, minmax(28px, 1fr));
  gap: 6px;
`;

const WeekLabel = styled.div`
  color: #6b7280;
  font-size: 11px;
  text-align: center;
`;

const DayLabel = styled.div`
  color: #9da3ae;
  font-size: 12px;
  line-height: 28px;
  height: 28px;
`;

const Cell = styled.button<{ $bg: string; $over?: boolean }>`
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
const slideInLeft = keyframes`
  from { opacity: .3; transform: translateX(20px); }
  to   { opacity: 1;  transform: translateX(0); }
`;
const slideInRight = keyframes`
  from { opacity: .3; transform: translateX(-20px); }
  to   { opacity: 1;  transform: translateX(0); }
`;
const Slide = styled.div<{ $dir: "next" | "prev" }>`
  animation: ${(p) =>
    p.$dir === "next"
      ? css`
          ${slideInLeft} .28s ease
        `
      : css`
          ${slideInRight} .28s ease
        `};
`;

/* ========== Helpers ========== */
const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
};
function monthStart(d: Date) {
  const x = new Date(d.getFullYear(), d.getMonth(), 1);
  x.setHours(0, 0, 0, 0);
  return x;
}
function monthEnd(d: Date) {
  const x = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  x.setHours(0, 0, 0, 0);
  return x;
}
function addMonths(d: Date, n: number) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + n);
  return x;
}
function startOfWeek(d: Date) {
  // semaine démarrant Dimanche; pour Lundi: const dow=(d.getDay()+6)%7;
  const x = new Date(d);
  const dow = x.getDay();
  x.setDate(x.getDate() - dow);
  x.setHours(0, 0, 0, 0);
  return x;
}
function hexToRgb(h: string) {
  const x = h.replace("#", "");
  return {
    r: parseInt(x.slice(0, 2), 16),
    g: parseInt(x.slice(2, 4), 16),
    b: parseInt(x.slice(4, 6), 16),
  };
}
function mix(a: string, b: string, t: number) {
  const A = hexToRgb(a),
    B = hexToRgb(b);
  const r = Math.round(A.r * (1 - t) + B.r * t);
  const g = Math.round(A.g * (1 - t) + B.g * t);
  const bl = Math.round(A.b * (1 - t) + B.b * t);
  return `rgb(${r},${g},${bl})`;
}
/* Violet → Rose → Rouge si >100% */
function colorFor(pct: number) {
  if (pct <= 0) return "#1f1f27";
  if (pct >= 130) return "#991b1b"; // très haut
  if (pct > 100) {
    const t = Math.min(1, (pct - 100) / 30); // 100→130
    return mix("#ef4444", "#ec4899", 1 - t); // vers rouge
  }
  // 0→100 : violet → rose
  const t = pct / 100;
  return mix("#8b5cf6", "#ec4899", t);
}

/* ========== Component ========== */
export const TrackingTab = () => {
  /* objectif partagé (utilisé aussi par HistoryTab si tu lis la même clé) */
  const TARGET_KEY = "cal-target-kcal";
  const [target, setTarget] = React.useState<number>(() => {
    const saved = localStorage.getItem(TARGET_KEY);
    return saved ? Math.max(800, parseInt(saved, 10) || 2000) : 2000;
  });
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
      <Header>
        <Title>Suivi — {monthLabel}</Title>{" "}
        <Nav>
          <IconBtn aria-label="Mois précédent" onClick={goPrev}>
            ‹
          </IconBtn>
          <IconBtn aria-label="Mois suivant" onClick={goNext}>
            ›
          </IconBtn>
        </Nav>
        <Right>
          <TargetWrap>
            max
            <TargetInput
              type="number"
              min={800}
              step={50}
              value={target}
              onChange={(e) =>
                setTarget(Math.max(800, parseInt(e.target.value || "0", 10)))
              }
            />
            kcal
          </TargetWrap>
        </Right>
      </Header>

      <Legend>
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
              <WeekLabel key={w.toISOString()}>
                {dd}/{mm}
              </WeekLabel>
            );
          })}

          {weekdayNames.map((label, row) => (
            <React.Fragment key={label}>
              <DayLabel>{label}</DayLabel>
              {weeks.map((w) => {
                const day = new Date(w);
                day.setDate(day.getDate() + row);
                const inMonth = day.getMonth() === mStart.getMonth();
                const key = startOfDay(day);
                const kcal = Math.round(kcalByDay.get(key) || 0);
                const pct = Math.min(200, (kcal / Math.max(1, target)) * 100);
                const over = pct > 100;
                const bg = inMonth ? colorFor(pct) : "#121218";
                return (
                  <Cell
                    key={key + String(row)}
                    $bg={bg}
                    $over={over}
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
