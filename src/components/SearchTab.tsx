import React from "react";
import type {
  Nutriments,
  SearchResult,
  SavedItem,
  RecentEntry,
  FavoriteEntry,
} from "../types";
import { storage } from "../utils/storage";
import {
  Button,
  Card,
  ClearIcon,
  HeaderRow,
  Heart,
  Hint,
  InlineHint,
  Label,
  LeftRow,
  ListScroll,
  ProductName,
  Row,
  SearchInput,
  Value,
} from "./StyleSearchTab";

/* ---------- styles locaux : sous-onglets + clear input ---------- */
import styled from "styled-components";

const InnerTabBar = styled.div`
  position: relative;
  display: flex;
  gap: 24px;
  border-bottom: 1px solid #262631;
  margin-top: 16px;
`;

const InnerTabBtn = styled.button<{ $active?: boolean }>`
  appearance: none;
  border: 0;
  background: transparent;
  cursor: pointer;
  color: ${(p) => (p.$active ? "#e6e6eb" : "#9da3ae")};
  font-weight: 700;
  font-size: 16px;
  line-height: 1;
  padding: 10px 2px 12px;
  position: relative;
  outline: none;
  &:focus-visible {
    box-shadow: 0 0 0 2px #6366f1aa;
    border-radius: 8px;
  }
`;

const InnerIndicator = styled.div<{ $x: number; $w: number }>`
  position: absolute;
  bottom: 0;
  height: 3px;
  background: #6366f1;
  border-radius: 3px;
  transition: transform 0.25s ease, width 0.25s ease;
  transform: translateX(${(p) => p.$x}px);
  width: ${(p) => p.$w}px;
  pointer-events: none;
`;

const Section = styled.section`
  padding-top: 12px;
`;

/* input avec bouton clear */
const InputWrap = styled.div`
  position: relative;
  flex: 1 1 260px;
`;
const SearchInputWithClear = styled(SearchInput)`
  padding-right: 40px; /* place pour la croix */
`;
const ClearBtn = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  height: 28px;
  min-width: 28px;
  padding: 0;
  border: 0;
  border-radius: 14px;
  background: #262631;
  color: #c7c7d1;
  cursor: pointer;
  display: grid;
  place-items: center;
  line-height: 1;
  font-size: 16px;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
`;

/* ---------- clés de stockage ---------- */
const storageKey = "cal-history-v1";
const recentKey = "cal-recents-v1";
const favoritesKey = "cal-favorites-v1";

type SearchTabProps = { onSaved?: () => void };
type InnerTabId = "favorites" | "recents";

export const SearchTab = ({ onSaved }: SearchTabProps) => {
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<SearchResult | null>(null);
  const [history, setHistory] = React.useState<RecentEntry[]>([]);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = React.useState<FavoriteEntry[]>([]);

  // sous-onglets
  const [innerTab, setInnerTab] = React.useState<InnerTabId>("favorites");
  const innerTabs = [
    { id: "favorites" as const, label: "Favoris" },
    { id: "recents" as const, label: "Récents" },
  ];
  const innerRef = React.useRef<HTMLDivElement>(null);
  const [underline, setUnderline] = React.useState({ x: 0, w: 0 });
  const updateUnderline = (id: InnerTabId) => {
    const el = innerRef.current?.querySelector<HTMLButtonElement>(
      `[data-in-tab="${id}"]`
    );
    if (!el || !innerRef.current) return;
    const { left, width } = el.getBoundingClientRect();
    const baseLeft = innerRef.current.getBoundingClientRect().left;
    setUnderline({ x: left - baseLeft, w: width });
  };
  React.useEffect(() => {
    updateUnderline(innerTab);
  }, [innerTab]);

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

  // ref pour remettre le focus après clear
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <>
      {/* Barre de recherche + bouton clear */}
      <Row>
        <SearchInput
          as="input"
          type="search" // clear natif iOS/Chrome
          inputMode="search"
          placeholder="Rechercher un aliment (ex: yaourt, pomme...)"
          value={query}
          onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") fetchFirstProduct();
          }}
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
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

      {/* Sous-onglets Favoris / Récents */}
      <InnerTabBar
        role="tablist"
        aria-label="Favoris et récents"
        ref={innerRef}
      >
        {innerTabs.map((t) => (
          <InnerTabBtn
            key={t.id}
            data-in-tab={t.id}
            role="tab"
            aria-selected={innerTab === t.id}
            aria-controls={`inner-panel-${t.id}`}
            id={`inner-tab-${t.id}`}
            $active={innerTab === t.id}
            onClick={() => setInnerTab(t.id)}
          >
            {t.label}
          </InnerTabBtn>
        ))}
        <InnerIndicator $x={underline.x} $w={underline.w} />
      </InnerTabBar>

      <ListScroll>
        {/* Panel Favoris */}
        <Section
          id="inner-panel-favorites"
          role="tabpanel"
          aria-labelledby="inner-tab-favorites"
          hidden={innerTab !== "favorites"}
        >
          {innerTab === "favorites" && (
            <>
              {favorites.length === 0 ? (
                <Hint>Aucun favori pour le moment.</Hint>
              ) : null}

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
                          <Value>
                            {proteins !== null ? `${proteins} g` : "—"}
                          </Value>
                        </Row>
                        <Row
                          style={
                            {
                              justifyContent: "space-between",
                            } as React.CSSProperties
                          }
                        >
                          <Button onClick={() => saveResult(r)}>
                            Enregistrer
                          </Button>
                        </Row>
                      </>
                    )}
                  </Card>
                );
              })}
            </>
          )}
        </Section>

        {/* Panel Récents */}
        <Section
          id="inner-panel-recents"
          role="tabpanel"
          aria-labelledby="inner-tab-recents"
          hidden={innerTab !== "recents"}
        >
          {innerTab === "recents" && (
            <>
              {history.filter((h) => h.item !== result).slice(0, 5).length ===
              0 ? (
                <Hint>Aucune recherche récente.</Hint>
              ) : null}

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
                          <Heart
                            $active={isFav}
                            onClick={() => toggleFavorite(h)}
                          >
                            {isFav ? "♥" : "♡"}
                          </Heart>
                          <div
                            style={{ flex: 1 }}
                            onClick={() => toggleExpand(h.id)}
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
                            <Value>
                              {sugars !== null ? `${sugars} g` : "—"}
                            </Value>
                          </Row>
                          <Row
                            style={
                              {
                                justifyContent: "space-between",
                              } as React.CSSProperties
                            }
                          >
                            <Label>Protéines</Label>
                            <Value>
                              {proteins !== null ? `${proteins} g` : "—"}
                            </Value>
                          </Row>
                          <Button onClick={() => saveResult(r)}>
                            Enregistrer
                          </Button>
                        </>
                      )}
                    </Card>
                  );
                })}
            </>
          )}
        </Section>
      </ListScroll>
    </>
  );
};
