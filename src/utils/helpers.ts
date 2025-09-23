/* ========== Helpers ========== */
export const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
};
export const monthStart = (d: Date) => {
  const x = new Date(d.getFullYear(), d.getMonth(), 1);
  x.setHours(0, 0, 0, 0);
  return x;
};
export const monthEnd = (d: Date) => {
  const x = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  x.setHours(0, 0, 0, 0);
  return x;
};
export const addMonths = (d: Date, n: number) => {
  const x = new Date(d);
  x.setMonth(x.getMonth() + n);
  return x;
};
export const startOfWeek = (d: Date) => {
  // semaine démarrant Dimanche; pour Lundi: const dow=(d.getDay()+6)%7;
  const x = new Date(d);
  const dow = x.getDay();
  x.setDate(x.getDate() - dow);
  x.setHours(0, 0, 0, 0);
  return x;
};
export const hexToRgb = (h: string) => {
  const x = h.replace("#", "");
  return {
    r: parseInt(x.slice(0, 2), 16),
    g: parseInt(x.slice(2, 4), 16),
    b: parseInt(x.slice(4, 6), 16),
  };
};

export const mix = (a: string, b: string, t: number) => {
  const A = hexToRgb(a),
    B = hexToRgb(b);
  const r = Math.round(A.r * (1 - t) + B.r * t);
  const g = Math.round(A.g * (1 - t) + B.g * t);
  const bl = Math.round(A.b * (1 - t) + B.b * t);
  return `rgb(${r},${g},${bl})`;
};

export const colorFor = (pct: number) => {
  if (pct <= 0) return "#1f1f27";
  if (pct >= 130) return "#991b1b"; // très haut
  if (pct > 100) {
    const t = Math.min(1, (pct - 100) / 30); // 100→130
    return mix("#ef4444", "#ec4899", 1 - t); // vers rouge
  }
  // 0→100 : violet → rose
  const t = pct / 100;
  return mix("#8b5cf6", "#ec4899", t);
};