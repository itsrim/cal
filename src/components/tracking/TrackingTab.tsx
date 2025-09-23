import React from "react";
import styled from "styled-components";
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
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
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

const Legend = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #9da3ae;
  font-size: 12px;
  flex-wrap: wrap;
`;

const Bar = styled.div`
  flex: 1 1 140px;
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(90deg, #8b5cf6, #6366f1, #4f46e5 80%, #ef4444);
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

/* ========== Helpers ========== */
const MAX_KCAL = 2000;

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
  // semaine commençant le dimanche (change en Monday: (dow+6)%7)
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
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const r = Math.round(ca.r * (1 - t) + cb.r * t);
  const g = Math.round(ca.g * (1 - t) + cb.g * t);
  const bl = Math.round(ca.b * (1 - t) + cb.b * t);
  return `rgb(${r},${g},${bl})`;
}
function colorFor(pct: number) {
  if (pct <= 0) return "#1f1f27";
  if (pct >= 130) return "#991b1b";
  if (pct > 100) {
    const t = Math.min(1, (pct - 100) / 30); // 100→130%
    return mix("#ef4444", "#4f46e5", 1 - t);
  }
  const t = pct / 100; // 0→100
  return mix("#4f46e5", "#8b5cf6", 1 - t);
}

/* ========== Component ========== */
export const TrackingTab = () => {
  // 1) lire l’historique depuis la même clé que HistoryTab
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
    // petit polling pour rester sync avec HistoryTab
    const id = setInterval(load, 1000);
    return () => clearInterval(id);
  }, []);

  // 2) regrouper kcal/jour
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

  // 3) pagination par mois (swipe gauche/droite)
  const [monthCursor, setMonthCursor] = React.useState<Date>(
    monthStart(new Date())
  );
  const mStart = monthStart(monthCursor);
  const mEnd = monthEnd(monthCursor);

  // colonnes = semaines recouvrant le mois courant
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
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touch.current.x;
    const dy = Math.abs(t.clientY - touch.current.y);
    touch.current = null;
    // swipe horizontal franc (évite scroll vertical)
    if (Math.abs(dx) > 60 && dy < 40) {
      setMonthCursor((prev) => monthStart(addMonths(prev, dx < 0 ? 1 : -1)));
    }
  };

  const monthLabel = new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  }).format(mStart);

  return (
    <Wrap onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <Header>
        <Title>Suivi — {monthLabel}</Title>
        <Nav>
          <IconBtn
            aria-label="Mois précédent"
            onClick={() => setMonthCursor((d) => monthStart(addMonths(d, -1)))}
          >
            ‹
          </IconBtn>
          <IconBtn
            aria-label="Mois suivant"
            onClick={() => setMonthCursor((d) => monthStart(addMonths(d, 1)))}
          >
            ›
          </IconBtn>
        </Nav>
      </Header>

      <Legend>
        <span>max {MAX_KCAL} kcal</span>
        <Bar />
      </Legend>

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
              // date de la cellule = début de colonne + row
              const day = new Date(w);
              day.setDate(day.getDate() + row);
              // grise les jours hors du mois courant
              const inMonth = day.getMonth() === mStart.getMonth();
              const key = startOfDay(day);
              const kcal = Math.round(kcalByDay.get(key) || 0);
              const pct = Math.min(200, (kcal / MAX_KCAL) * 100);
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
    </Wrap>
  );
};
