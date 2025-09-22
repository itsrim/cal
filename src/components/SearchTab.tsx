import React from "react";
import { Search, Ellipsis, ScanBarcode } from "lucide-react";
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
  HeaderRow,
  Heart,
  Hint,
  InlineHint,
  InnerIndicator,
  InnerTabBar,
  InnerTabBtn,
  Label,
  LeftRow,
  ListScroll,
  ProductName,
  Row,
  SearchInput,
  Section,
  Value,
} from "./StyleSearchTab";
import { fetchProductByBarcode } from "../api/openfoodfacts";
import { BarCodeScanner } from "./BarreCodeScanner";

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
  const [scanOpen, setScanOpen] = React.useState(false);

  // scan
  const fetchByEAN = React.useCallback(async (ean: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const prod = await fetchProductByBarcode(ean);
      const first = {
        product_name: prod.product_name ?? "Produit",
        nutriments: prod.nutriments ?? {},
      } as SearchResult;
      setResult(first);
      const id = `${Date.now()}-${first.product_name || "Produit"}`;
      setHistory((prev) => {
        const next = [{ id, item: first }, ...prev].slice(0, 10);
        storage.setItem("cal-recents-v1", JSON.stringify(next)).catch(() => {});
        return next;
      });
    } catch {
      setError("Produit introuvable pour ce code-barres.");
    } finally {
      setLoading(false);
    }
  }, []);
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
        <Button
          onClick={fetchFirstProduct}
          disabled={!canSearch}
          aria-label="Rechercher"
        >
          {loading ? <Ellipsis /> : <Search />}
        </Button>

        <Button
          onClick={() => setScanOpen(true)}
          disabled={loading}
          aria-label="Scanner code-barres"
        >
          <ScanBarcode />
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
      {scanOpen && (
        <BarCodeScanner
          onClose={() => setScanOpen(false)}
          onDetected={(ean) => {
            setScanOpen(false);
            fetchByEAN(ean);
          }}
        />
      )}
    </>
  );
};
