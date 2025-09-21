import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, TextInput } from "react-native";
import styled from "styled-components/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { SavedItem } from "./types";

const CalendarStrip = styled.View`
  height: 64px;
`;

const DayPill = styled.TouchableOpacity<{ selected?: boolean }>`
  height: 48px;
  width: 56px;
  margin-right: 10px;
  border-radius: 12px;
  background-color: ${(p) => (p.selected ? "#4f46e5" : "#1a1a22")};
  align-items: center;
  justify-content: center;
`;

const DayText = styled.Text`
  color: #e6e6eb;
  font-weight: 700;
  text-align: center;
`;

const Card = styled.View`
  margin-top: 12px;
  padding: 16px;
  border-radius: 16px;
  background-color: #13131a;
  gap: 8px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ProductName = styled.Text`
  color: #c7c7d1;
  font-size: 16px;
  font-weight: 600;
`;

const InlineHint = styled.Text`
  color: #6b7280;
  font-size: 12px;
  margin-left: 6px;
`;

const Label = styled.Text`
  color: #9da3ae;
`;

const Value = styled.Text`
  color: #e6e6eb;
  font-weight: 700;
`;

const Hint = styled.Text`
  color: #6b7280;
`;

const IconButton = styled.TouchableOpacity`
  padding: 8px;
  margin-left: 8px;
`;

const QtyInput = styled.TextInput`
  width: 72px;
  height: 36px;
  border-radius: 8px;
  background-color: #1a1a22;
  color: #f5f5f7;
  text-align: center;
` as unknown as typeof TextInput;

const LeftRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const Trash = styled.Text`
  color: #ef4444;
  font-weight: 900;
  font-size: 16px;
`;

const storageKey = "cal-history-v1";

export default function HistoryTab() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [saved, setSaved] = useState<SavedItem[]>([]);

  const startOfDay = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x.getTime();
  };
  const sameDay = (a: number, b: number) =>
    startOfDay(new Date(a)) === startOfDay(new Date(b));

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(storageKey);
        const list: SavedItem[] = raw ? JSON.parse(raw) : [];
        setSaved(Array.isArray(list) ? list : []);
      } catch {
        setSaved([]);
      }
    };
    const unsubscribe = setInterval(load, 1000);
    load();
    return () => clearInterval(unsubscribe as unknown as number);
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

  const totalQtyForDay = useMemo(() => {
    return itemsForSelectedDay.reduce(
      (sum, it) => sum + (it.quantity ?? 100),
      0
    );
  }, [itemsForSelectedDay]);

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
      await AsyncStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  return (
    <>
      <CalendarStrip>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {daysStrip.map((d) => {
            const selected = sameDay(d.getTime(), selectedDate.getTime());
            return (
              <DayPill
                key={d.toISOString()}
                selected={selected}
                onPress={() => setSelectedDate(d)}
              >
                <DayText>{displayDay(d)}</DayText>
              </DayPill>
            );
          })}
        </ScrollView>
      </CalendarStrip>

      <Row>
        <Label>Total du jour</Label>
        <Value>
          {totalQtyForDay} g · {Math.round(totalKcalForDay)} kcal
        </Value>
      </Row>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
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
                      onPress={() => removeItem(it.id)}
                      accessibilityLabel="Supprimer définitivement"
                    >
                      <Trash>🗑️</Trash>
                    </IconButton>
                    <ProductName>{it.product_name}</ProductName>
                  </LeftRow>
                  <Row>
                    <QtyInput
                      keyboardType="numeric"
                      value={String(it.quantity ?? 100)}
                      onChangeText={async (text) => {
                        const v = Math.max(0, parseInt(text || "0", 10) || 0);
                        const next = saved.map((s) =>
                          s.id === it.id ? { ...s, quantity: v } : s
                        );
                        setSaved(next);
                        await AsyncStorage.setItem(
                          storageKey,
                          JSON.stringify(next)
                        );
                      }}
                    />
                    <InlineHint style={{ marginLeft: 4 }}>g</InlineHint>
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
      </ScrollView>
    </>
  );
}
