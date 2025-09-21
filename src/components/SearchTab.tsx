import React from "react";
import styled from "styled-components";
import type {
  Nutriments,
  SearchResult,
  SavedItem,
  RecentEntry,
  FavoriteEntry,
} from "../types";
import { storage } from "../utils/storage";

const ListScroll = styled.div`
  flex: 1;
  min-height: 0; /* ← autorise le scroll quand il y a des éléments */
  overflow-y: auto;
  padding-right: 4px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1 1 260px;
  height: 48px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid #262631;
  background-color: #1a1a22;
  color: #f5f5f7;
`;

const Button = styled.button`
  height: 48px;
  padding: 0 18px;
  border-radius: 12px;
  border: 0;
  background-color: #4f46e5;
  color: white;
  font-weight: 700;
  cursor: pointer;
  display: grid;
  place-items: center;
`;

const Card = styled.div`
  margin-top: 12px;
  padding: 16px;
  border-radius: 16px;
  background-color: #13131a;
  display: grid;
  gap: 8px;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

const LeftRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
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

const Heart = styled.span<{ $active?: boolean }>`
  color: ${(p) => (p.$active ? "#ec4899" : "#e6e6eb")};
  font-weight: 700;
  font-size: 18px;
  cursor: pointer;
`;

// const ListScroll = styled.div`
//   flex: 1;
//   overflow-y: auto;
//   max-height: calc(100vh - 300px);
//   padding-right: 4px;
// `;

type SearchTabProps = { onSaved?: () => void };

const storageKey = "cal-history-v1";
const recentKey = "cal-recents-v1";
const favoritesKey = "cal-favorites-v1";

export const SearchTab = ({ onSaved }: SearchTabProps) => {
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<SearchResult | null>(null);
  const [history, setHistory] = React.useState<RecentEntry[]>([]);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = React.useState<FavoriteEntry[]>([]);

  React.useEffect(() => {
    (async () => {
      try {
        const raw = await storage.getItem(recentKey);
        const list: RecentEntry[] = raw ? JSON.parse(raw) : [];
        setHistory(Array.isArray(list) ? list : []);
      } catch {
        setHistory([]);
      }
      try {
        const rawFav = await storage.getItem(favoritesKey);
        const favList: FavoriteEntry[] = rawFav ? JSON.parse(rawFav) : [];
        setFavorites(Array.isArray(favList) ? favList : []);
      } catch {
        setFavorites([]);
      }
    })();
  }, []);

  const canSearch = React.useMemo(
    () => query.trim().length > 0 && !loading,
    [query, loading]
  );

  const fetchFirstProduct = React.useCallback(async () => {
    if (!canSearch) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const params = new URLSearchParams({
        search_terms: query.trim(),
        search_simple: "1",
        json: "1",
        page_size: "1",
        fields: "nutriments,product_name",
      });
      const url = `https://world.openfoodfacts.org/cgi/search.pl?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const first: SearchResult | undefined = data?.products?.[0];
      if (!first) {
        setError("Aucun produit trouvé.");
        setResult(null);
      } else {
        setResult(first);
        const id = `${Date.now()}-${first.product_name || "Produit"}`;
        setHistory((prev) => {
          const next = [{ id, item: first }, ...prev].slice(0, 10);
          storage.setItem(recentKey, JSON.stringify(next)).catch(() => {});
          return next;
        });
      }
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setLoading(false);
    }
  }, [canSearch, query]);

  const nutriments: Nutriments | undefined = result?.nutriments;
  const fat = nutriments?.fat_100g ?? null;
  const sugars = nutriments?.sugars_100g ?? null;
  const proteins = nutriments?.proteins_100g ?? null;
  const kcal =
    (nutriments as any)?.["energy-kcal_100g"] ??
    (nutriments as any)?.energy_kcal_100g ??
    null;

  const saveResult = React.useCallback(
    async (r: SearchResult | null) => {
      if (!r || !r.nutriments) return;
      const item: SavedItem = {
        id: `${Date.now()}`,
        product_name: r.product_name || "Produit",
        nutriments: r.nutriments,
        timestamp: Date.now(),
        quantity: 100,
      };
      try {
        const raw = await storage.getItem(storageKey);
        const existing: SavedItem[] = raw ? JSON.parse(raw) : [];
        const next = [item, ...existing];
        await storage.setItem(storageKey, JSON.stringify(next));
        onSaved?.();
      } catch {}
    },
    [onSaved]
  );

  const handleSave = React.useCallback(
    () => saveResult(result),
    [saveResult, result]
  );

  const toggleExpand = React.useCallback((id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const toggleFavorite = React.useCallback(async (entry: RecentEntry) => {
    setFavorites((prev) => {
      const exists = prev.some(
        (f) => f.item.product_name === entry.item.product_name
      );
      const next = exists
        ? prev.filter((f) => f.item.product_name !== entry.item.product_name)
        : [{ id: entry.id, item: entry.item }, ...prev];
      storage.setItem(favoritesKey, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  return (
    <>
      <Row>
        <SearchInput
          placeholder="Rechercher un aliment (ex: yaourt, pomme...)"
          value={query}
          onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") fetchFirstProduct();
          }}
        />
        <Button onClick={fetchFirstProduct} disabled={!canSearch}>
          {loading ? "..." : "Entrer"}
        </Button>
      </Row>

      {error ? <Hint>{error}</Hint> : null}

      {result && (
        <Card>
          <HeaderRow>
            <ProductName>
              {result.product_name || "Produit"} <InlineHint>(100g)</InlineHint>
            </ProductName>
            <Value>{kcal !== null ? `${kcal} kcal` : "—"}</Value>
          </HeaderRow>
          <Row
            style={{ justifyContent: "space-between" } as React.CSSProperties}
          >
            <Label>Lipides</Label>
            <Value>{fat !== null ? `${fat} g` : "—"}</Value>
          </Row>
          <Row
            style={{ justifyContent: "space-between" } as React.CSSProperties}
          >
            <Label>Sucres</Label>
            <Value>{sugars !== null ? `${sugars} g` : "—"}</Value>
          </Row>
          <Row
            style={{ justifyContent: "space-between" } as React.CSSProperties}
          >
            <Label>Protéines</Label>
            <Value>{proteins !== null ? `${proteins} g` : "—"}</Value>
          </Row>
          <Button onClick={handleSave}>Enregistrer</Button>
        </Card>
      )}

      {!result && !error && !loading ? (
        <Hint>Entrez une recherche puis appuyez sur Entrer.</Hint>
      ) : null}

      <ListScroll>
        {favorites.length > 0 && <Hint style={{ marginTop: 12 }}>Favoris</Hint>}
        {favorites.map((h) => {
          const r = h.item;
          const n: Nutriments | undefined = r.nutriments;
          const fat = n?.fat_100g ?? null;
          const sugars = n?.sugars_100g ?? null;
          const proteins = n?.proteins_100g ?? null;
          const kcal =
            (n as any)?.["energy-kcal_100g"] ??
            (n as any)?.energy_kcal_100g ??
            null;
          const isOpen = !!expanded[`fav-${h.id}`];
          return (
            <Card key={`fav-${h.id}`}>
              <HeaderRow>
                <LeftRow>
                  <Heart $active onClick={() => toggleFavorite(h)}>
                    ♥
                  </Heart>
                  <div
                    style={{ flex: 1 }}
                    onClick={() =>
                      setExpanded((prev) => ({
                        ...prev,
                        [`fav-${h.id}`]: !prev[`fav-${h.id}`],
                      }))
                    }
                  >
                    <ProductName>
                      {r.product_name || "Produit"}{" "}
                      <InlineHint>(100g)</InlineHint>
                    </ProductName>
                  </div>
                </LeftRow>
                <Value>{kcal !== null ? `${kcal} kcal` : "—"}</Value>
              </HeaderRow>
              {isOpen && (
                <>
                  <Row
                    style={
                      { justifyContent: "space-between" } as React.CSSProperties
                    }
                  >
                    <Label>Lipides</Label>
                    <Value>{fat !== null ? `${fat} g` : "—"}</Value>
                  </Row>
                  <Row
                    style={
                      { justifyContent: "space-between" } as React.CSSProperties
                    }
                  >
                    <Label>Sucres</Label>
                    <Value>{sugars !== null ? `${sugars} g` : "—"}</Value>
                  </Row>
                  <Row
                    style={
                      { justifyContent: "space-between" } as React.CSSProperties
                    }
                  >
                    <Label>Protéines</Label>
                    <Value>{proteins !== null ? `${proteins} g` : "—"}</Value>
                  </Row>
                  <Row
                    style={
                      { justifyContent: "space-between" } as React.CSSProperties
                    }
                  >
                    <Button onClick={() => saveResult(r)}>Enregistrer</Button>
                  </Row>
                </>
              )}
            </Card>
          );
        })}

        {history.filter((h) => h.item !== result).slice(0, 5).length > 0 && (
          <Hint style={{ marginTop: 12 }}>Récents</Hint>
        )}

        {history
          .filter((h) => h.item !== result)
          .slice(0, 5)
          .map((h) => {
            const r = h.item;
            const n: Nutriments | undefined = r.nutriments;
            const fat = n?.fat_100g ?? null;
            const sugars = n?.sugars_100g ?? null;
            const proteins = n?.proteins_100g ?? null;
            const kcal =
              (n as any)?.["energy-kcal_100g"] ??
              (n as any)?.energy_kcal_100g ??
              null;
            const isOpen = !!expanded[h.id];
            const isFav = favorites.some(
              (f) => f.item.product_name === r.product_name
            );
            return (
              <Card key={h.id}>
                <HeaderRow>
                  <LeftRow>
                    <Heart $active={isFav} onClick={() => toggleFavorite(h)}>
                      {isFav ? "♥" : "♡"}
                    </Heart>
                    <div style={{ flex: 1 }} onClick={() => toggleExpand(h.id)}>
                      <ProductName>
                        {r.product_name || "Produit"}{" "}
                        <InlineHint>(100g)</InlineHint>
                      </ProductName>
                    </div>
                  </LeftRow>
                  <Value>{kcal !== null ? `${kcal} kcal` : "—"}</Value>
                </HeaderRow>
                {isOpen && (
                  <>
                    <Row
                      style={
                        {
                          justifyContent: "space-between",
                        } as React.CSSProperties
                      }
                    >
                      <Label>Lipides</Label>
                      <Value>{fat !== null ? `${fat} g` : "—"}</Value>
                    </Row>
                    <Row
                      style={
                        {
                          justifyContent: "space-between",
                        } as React.CSSProperties
                      }
                    >
                      <Label>Sucres</Label>
                      <Value>{sugars !== null ? `${sugars} g` : "—"}</Value>
                    </Row>
                    <Row
                      style={
                        {
                          justifyContent: "space-between",
                        } as React.CSSProperties
                      }
                    >
                      <Label>Protéines</Label>
                      <Value>{proteins !== null ? `${proteins} g` : "—"}</Value>
                    </Row>
                    <Button onClick={() => saveResult(r)}>Enregistrer</Button>
                  </>
                )}
              </Card>
            );
          })}
      </ListScroll>
    </>
  );
};
