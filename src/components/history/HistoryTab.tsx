import React, { useEffect, useMemo, useState, useRef } from "react";
import { Nutriments, SavedItem } from "../../types";
import { storage } from "../../utils/storage";
import { Trash2 } from "lucide-react";
import {
  CalendarStrip,
  Card,
  DayPill,
  Fill,
  Hint,
  IconButton,
  InlineHint,
  Label,
  LeftRow,
  ListScroll,
  PctLeft,
  ProductName,
  ProgressWrap,
  QtyInput,
  RightInfo,
  Row,
  SubTitle,
  Track,
  Trash,
  Value,
} from "./StyleHistoryTab";

const storageKey = "cal-history-v1";
// en haut de HistoryTab:

export const HistoryTab = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [saved, setSaved] = useState<SavedItem[]>([]);
  // const TARGET_KEY = "cal-target-kcal";
  // const [targetKcal] = useState<number>(() => {
  //   const v = localStorage.getItem(TARGET_KEY);
  //   return v ? Math.max(800, parseInt(v, 10) || 2000) : 2000;
  // });

  // Max journaliers (équilibré pour 2000 kcal)
  const MAX_CARBS = 250; // g
  const MAX_FAT = 70; // g
  const MAX_PROT = 75; // g

  const todayRef = useRef<HTMLButtonElement>(null);

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
  useEffect(() => {
    todayRef.current?.scrollIntoView({ inline: "center", block: "nearest" });
  }, []);

  const daysStrip = useMemo(() => {
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

  const itemsForSelectedDay = useMemo(
    () => saved.filter((s) => sameDay(s.timestamp, selectedDate.getTime())),
    [saved, selectedDate]
  );

  const totalQtyForDay = useMemo(
    () =>
      itemsForSelectedDay.reduce((sum, it) => sum + (it.quantity ?? 100), 0),
    [itemsForSelectedDay]
  );

  const totalKcalForDay = useMemo(() => {
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

  // helpers: récupère la valeur “par 100g” en priorité carbohydrates_100g
  const getCarbs100 = (n?: Nutriments | null) =>
    (n as any)?.carbohydrates_100g ??
    (n as any)?.carbs_100g ??
    (n as any)?.sugars_100g ??
    null;

  const getFat100 = (n?: Nutriments | null) => n?.fat_100g ?? null;

  const getProt100 = (n?: Nutriments | null) => n?.proteins_100g ?? null;

  // somme grammes journaliers ajustés à la quantité
  const totalCarbs = useMemo(() => {
    return itemsForSelectedDay.reduce((sum, it) => {
      const per100 = getCarbs100(it.nutriments);
      const qty = it.quantity ?? 100;
      const g = typeof per100 === "number" ? (per100 * qty) / 100 : 0;
      return sum + g;
    }, 0);
  }, [itemsForSelectedDay]);

  const totalFat = useMemo(() => {
    return itemsForSelectedDay.reduce((sum, it) => {
      const per100 = getFat100(it.nutriments);
      const qty = it.quantity ?? 100;
      const g = typeof per100 === "number" ? (per100 * qty) / 100 : 0;
      return sum + g;
    }, 0);
  }, [itemsForSelectedDay]);

  const totalProt = useMemo(() => {
    return itemsForSelectedDay.reduce((sum, it) => {
      const per100 = getProt100(it.nutriments);
      const qty = it.quantity ?? 100;
      const g = typeof per100 === "number" ? (per100 * qty) / 100 : 0;
      return sum + g;
    }, 0);
  }, [itemsForSelectedDay]);

  const pct = (val: number, max: number) => (max > 0 ? (val / max) * 100 : 0);

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
              ref={selected ? todayRef : undefined}
            >
              {displayDay(d)}
            </DayPill>
          );
        })}
      </CalendarStrip>

      <Row>
        <SubTitle>Total du jour</SubTitle>
        <Value>
          {totalQtyForDay} g · {Math.round(totalKcalForDay)} kcal
        </Value>
      </Row>

      <ProgressWrap>
        {/* Glucides */}
        <Track>
          <Fill $pct={pct(totalCarbs, MAX_CARBS)} $color="#ff9f43" />
          <PctLeft $over={pct(totalCarbs, MAX_CARBS) > 100}>
            {Math.round(pct(totalCarbs, MAX_CARBS))}%
          </PctLeft>
          <RightInfo>
            <span>Glucides</span>
            <span>
              {Math.round(totalCarbs)} g / {MAX_CARBS} g
            </span>
          </RightInfo>
        </Track>

        {/* Lipides */}
        <Track>
          <Fill $pct={pct(totalFat, MAX_FAT)} $color="#9980FA" />
          <PctLeft $over={pct(totalFat, MAX_FAT) > 100}>
            {Math.round(pct(totalFat, MAX_FAT))}%
          </PctLeft>
          <RightInfo>
            <span>Lipides</span>
            <span>
              {Math.round(totalFat)} g / {MAX_FAT} g
            </span>
          </RightInfo>
        </Track>

        {/* Protéines */}
        <Track>
          <Fill $pct={pct(totalProt, MAX_PROT)} $color="#1dd1a1" />
          <PctLeft $over={pct(totalProt, MAX_PROT) > 100}>
            {Math.round(pct(totalProt, MAX_PROT))}%
          </PctLeft>
          <RightInfo>
            <span>Protéines</span>
            <span>
              {Math.round(totalProt)} g / {MAX_PROT} g
            </span>
          </RightInfo>
        </Track>
      </ProgressWrap>

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
                      <Trash>
                        <Trash2 size={20} />
                      </Trash>
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
                  <Label>Calories</Label>
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
