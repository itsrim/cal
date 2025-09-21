import React from "react";
import styled from "styled-components";
import { SavedItem } from "../types";
import { storage } from "../utils/storage";

const CalendarStrip = styled.div`
  height: 64px;
  overflow-x: auto;
  display: flex;
  gap: 10px;
  padding-bottom: 6px;
  scrollbar-width: thin;
`;

const DayPill = styled.button<{ $selected?: boolean }>`
  height: 48px;
  width: 56px;
  min-width: 56px;
  border-radius: 12px;
  border: 0;
  background-color: ${(p) => (p.$selected ? "#4f46e5" : "#1a1a22")};
  color: #e6e6eb;
  font-weight: 700;
  white-space: pre-line;
  display: grid;
  place-items: center;
  cursor: pointer;
`;

const Card = styled.div`
  margin-top: 12px;
  padding: 16px;
  border-radius: 16px;
  background-color: #13131a;
  display: grid;
  gap: 8px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const ProductName = styled.div`
  color: #c7c7d1;
  font-size: 16px;
  font-weight: 600;
`;

const InlineHint = styled.span`
  color: #6b7280;
  font-size: 12px;
  margin-left: 6px;
`;

const Label = styled.span`
  color: #9da3ae;
`;

const Value = styled.span`
  color: #e6e6eb;
  font-weight: 700;
`;

const Hint = styled.p`
  color: #6b7280;
  margin: 8px 0;
`;

const IconButton = styled.button`
  padding: 8px;
  margin-left: 8px;
  border: 0;
  background: transparent;
  cursor: pointer;
`;

const QtyInput = styled.input`
  width: 72px;
  height: 36px;
  border-radius: 8px;
  background-color: #1a1a22;
  color: #f5f5f7;
  text-align: center;
  border: 1px solid #262631;
`;

const LeftRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Trash = styled.span`
  color: #ef4444;
  font-weight: 900;
  font-size: 16px;
`;

const ListScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 260px);
  padding-right: 4px;
`;

const storageKey = "cal-history-v1";

export const HistoryTab = () => {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [saved, setSaved] = React.useState<SavedItem[]>([]);

  const startOfDay = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x.getTime();
  };
  const sameDay = (a: number, b: number) =>
    startOfDay(new Date(a)) === startOfDay(new Date(b));

  React.useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const raw = await storage.getItem(storageKey);
        const list: SavedItem[] = raw ? JSON.parse(raw) : [];
        if (alive) setSaved(Array.isArray(list) ? list : []);
      } catch {
        if (alive) setSaved([]);
      }
    };
    const id = setInterval(load, 1000);
    load();
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const daysStrip = React.useMemo(() => {
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    const arr: Date[] = [];
    for (let i = -7; i <= 7; i += 1) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, []);

  const displayDay = (d: Date) => {
    const day = d.getDate();
    const options: Intl.DateTimeFormatOptions = { weekday: "short" };
    const w = new Intl.DateTimeFormat("fr-FR", options).format(d);
    return `${w.toUpperCase()}\n${day}`;
  };

  const itemsForSelectedDay = React.useMemo(
    () => saved.filter((s) => sameDay(s.timestamp, selectedDate.getTime())),
    [saved, selectedDate]
  );

  const totalQtyForDay = React.useMemo(
    () =>
      itemsForSelectedDay.reduce((sum, it) => sum + (it.quantity ?? 100), 0),
    [itemsForSelectedDay]
  );

  const totalKcalForDay = React.useMemo(() => {
    return itemsForSelectedDay.reduce((sum, it) => {
      const base =
        (it.nutriments as any)?.["energy-kcal_100g"] ??
        (it.nutriments as any)?.energy_kcal_100g ??
        null;
      const qty = it.quantity ?? 100;
      const adjusted = typeof base === "number" ? (base * qty) / 100 : 0;
      return sum + adjusted;
    }, 0);
  }, [itemsForSelectedDay]);

  const removeItem = async (id: string) => {
    try {
      const next = saved.filter((s) => s.id !== id);
      setSaved(next);
      await storage.setItem(storageKey, JSON.stringify(next));
    } catch {}
  };

  return (
    <>
      <CalendarStrip>
        {daysStrip.map((d) => {
          const selected = sameDay(d.getTime(), selectedDate.getTime());
          return (
            <DayPill
              key={d.toISOString()}
              $selected={selected}
              onClick={() => setSelectedDate(d)}
            >
              {displayDay(d)}
            </DayPill>
          );
        })}
      </CalendarStrip>

      <Row>
        <Label>Total du jour</Label>
        <Value>
          {totalQtyForDay} g · {Math.round(totalKcalForDay)} kcal
        </Value>
      </Row>

      <ListScroll>
        {itemsForSelectedDay.length === 0 ? (
          <Hint>Aucun aliment enregistré ce jour.</Hint>
        ) : (
          itemsForSelectedDay.map((it) => {
            const nf = it.nutriments;
            const f = nf?.fat_100g ?? null;
            const s = nf?.sugars_100g ?? null;
            const p = nf?.proteins_100g ?? null;
            const k =
              (nf as any)?.["energy-kcal_100g"] ??
              (nf as any)?.energy_kcal_100g ??
              null;
            return (
              <Card key={it.id}>
                <Row>
                  <LeftRow>
                    <IconButton
                      onClick={() => removeItem(it.id)}
                      aria-label="Supprimer définitivement"
                    >
                      <Trash>🗑️</Trash>
                    </IconButton>
                    <ProductName>{it.product_name}</ProductName>
                  </LeftRow>
                  <Row>
                    <QtyInput
                      inputMode="numeric"
                      value={String(it.quantity ?? 100)}
                      onChange={async (e) => {
                        const text = (e.target as HTMLInputElement).value;
                        const v = Math.max(0, parseInt(text || "0", 10) || 0);
                        const next = saved.map((s) =>
                          s.id === it.id ? { ...s, quantity: v } : s
                        );
                        setSaved(next);
                        await storage.setItem(storageKey, JSON.stringify(next));
                      }}
                    />
                    <InlineHint>g</InlineHint>
                  </Row>
                </Row>
                <Row>
                  <Label>cals</Label>
                  <Value>
                    {k !== null
                      ? `${Math.round((k * (it.quantity ?? 100)) / 100)} kcal`
                      : "—"}
                  </Value>
                </Row>
                <Row>
                  <Label>Lipides</Label>
                  <Value>{f !== null ? `${f} g` : "—"}</Value>
                </Row>
                <Row>
                  <Label>Sucres</Label>
                  <Value>{s !== null ? `${s} g` : "—"}</Value>
                </Row>
                <Row>
                  <Label>Protéines</Label>
                  <Value>{p !== null ? `${p} g` : "—"}</Value>
                </Row>
              </Card>
            );
          })
        )}
      </ListScroll>
    </>
  );
};
