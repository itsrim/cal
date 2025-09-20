import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Keyboard, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import type { Nutriments, SearchResult, SavedItem, RecentEntry, FavoriteEntry } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  height: 48px;
  padding: 0 14px;
  border-radius: 12px;
  background-color: #1a1a22;
  color: #f5f5f7;
` as unknown as typeof TextInput;

const Button = styled.TouchableOpacity`
  height: 48px;
  padding: 0 18px;
  border-radius: 12px;
  background-color: #4f46e5;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: 700;
`;

const Card = styled.View`
  margin-top: 12px;
  padding: 16px;
  border-radius: 16px;
  background-color: #13131a;
  gap: 8px;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const LeftRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
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

const Heart = styled.Text<{active?: boolean}>`
  color: ${p => (p.active ? '#ec4899' : '#e6e6eb')};
  font-weight: 700;
  font-size: 18px;
`;

type Props = {
  onSaved?: () => void;
};

const storageKey = 'calorie-history-v1';
const recentKey = 'calorie-recents-v1';
const favoritesKey = 'calorie-favorites-v1';

export default function SearchTab({ onSaved }: Props) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [history, setHistory] = useState<RecentEntry[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);

  React.useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(recentKey);
        const list: RecentEntry[] = raw ? JSON.parse(raw) : [];
        setHistory(Array.isArray(list) ? list : []);
      } catch {
        setHistory([]);
      }
      try {
        const rawFav = await AsyncStorage.getItem(favoritesKey);
        const favList: FavoriteEntry[] = rawFav ? JSON.parse(rawFav) : [];
        setFavorites(Array.isArray(favList) ? favList : []);
      } catch {
        setFavorites([]);
      }
    })();
  }, []);

  const canSearch = useMemo(() => query.trim().length > 0 && !loading, [query, loading]);

  const fetchFirstProduct = useCallback(async () => {
    if (!canSearch) return;
    setLoading(true);
    setError(null);
    setResult(null);
    Keyboard.dismiss();
    try {
      const params = new URLSearchParams({
        search_terms: query.trim(),
        search_simple: '1',
        json: '1',
        page_size: '1',
        fields: 'nutriments,product_name',
      });
      const url = `https://world.openfoodfacts.org/cgi/search.pl?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const first: SearchResult | undefined = data?.products?.[0];
      if (!first) {
        setError('Aucun produit trouvé.');
        setResult(null);
      } else {
        setResult(first);
        const id = `${Date.now()}-${first.product_name || 'Produit'}`;
        setHistory(prev => {
          const next = [{ id, item: first }, ...prev].slice(0, 10);
          AsyncStorage.setItem(recentKey, JSON.stringify(next)).catch(() => {});
          return next;
        });
      }
    } catch (e: unknown) {
      setError('Erreur réseau. Réessayez.');
    } finally {
      setLoading(false);
    }
  }, [canSearch, query]);

  const nutriments: Nutriments | undefined = result?.nutriments;
  const fat = nutriments?.fat_100g ?? null;
  const sugars = nutriments?.sugars_100g ?? null;
  const proteins = nutriments?.proteins_100g ?? null;
  const kcal = (nutriments as any)?.['energy-kcal_100g'] ?? (nutriments as any)?.energy_kcal_100g ?? null;

  const saveResult = useCallback(async (r: SearchResult | null) => {
    if (!r || !r.nutriments) return;
    const item: SavedItem = {
      id: `${Date.now()}`,
      product_name: r.product_name || 'Produit',
      nutriments: r.nutriments,
      timestamp: Date.now(),
      quantity: 100,
    };
    try {
      const raw = await AsyncStorage.getItem(storageKey);
      const existing: SavedItem[] = raw ? JSON.parse(raw) : [];
      const next = [item, ...existing];
      await AsyncStorage.setItem(storageKey, JSON.stringify(next));
      onSaved?.();
    } catch {
      // ignore
    }
  }, [onSaved]);

  const handleSave = useCallback(() => saveResult(result), [saveResult, result]);

  const toggleExpand = useCallback((id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const toggleFavorite = useCallback(async (entry: RecentEntry) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.item.product_name === entry.item.product_name);
      const next = exists
        ? prev.filter(f => f.item.product_name !== entry.item.product_name)
        : [{ id: entry.id, item: entry.item }, ...prev];
      AsyncStorage.setItem(favoritesKey, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  return (
    <>
      <Row>
        <SearchInput
          placeholder="Rechercher un aliment (ex: yaourt, pomme...)"
          placeholderTextColor="#6b7280"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          onSubmitEditing={fetchFirstProduct}
        />
        <Button onPress={fetchFirstProduct} activeOpacity={0.8} disabled={!canSearch}>
          {loading ? <ActivityIndicator color="#fff" /> : <ButtonText>Entrer</ButtonText>}
        </Button>
      </Row>

      {error ? <Hint>{error}</Hint> : null}

      {result && (
        <Card>
          <HeaderRow>
            <ProductName>
              {result.product_name || 'Produit'}
              <InlineHint>(100g)</InlineHint>
            </ProductName>
            <Value>{kcal !== null ? `${kcal} kcal` : '—'}</Value>
          </HeaderRow>
          <Row style={{ justifyContent: 'space-between' }}>
            <Label>Lipides</Label>
            <Value>{fat !== null ? `${fat} g` : '—'}</Value>
          </Row>
          <Row style={{ justifyContent: 'space-between' }}>
            <Label>Sucres</Label>
            <Value>{sugars !== null ? `${sugars} g` : '—'}</Value>
          </Row>
          <Row style={{ justifyContent: 'space-between' }}>
            <Label>Protéines</Label>
            <Value>{proteins !== null ? `${proteins} g` : '—'}</Value>
          </Row>
          <Button onPress={handleSave} activeOpacity={0.8}>
            <ButtonText>Enregistrer</ButtonText>
          </Button>
        </Card>
      )}

      {!result && !error && !loading ? (
        <Hint>Entrez une recherche puis appuyez sur Entrer.</Hint>
      ) : null}

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {favorites.length > 0 && (
          <Hint style={{ marginTop: 12 }}>Favoris</Hint>
        )}

        {favorites.map(h => {
        const r = h.item;
        const n: Nutriments | undefined = r.nutriments;
        const fat = n?.fat_100g ?? null;
        const sugars = n?.sugars_100g ?? null;
        const proteins = n?.proteins_100g ?? null;
        const kcal = (n as any)?.['energy-kcal_100g'] ?? (n as any)?.energy_kcal_100g ?? null;
        const isOpen = !!expanded[`fav-${h.id}`];
        return (
          <Card key={`fav-${h.id}`}>
            <HeaderRow>
              <LeftRow>
                <TouchableOpacity onPress={() => toggleFavorite(h)}>
                  <Heart active>♥</Heart>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={{ flex: 1 }} 
                  onPress={() => setExpanded(prev => ({ ...prev, [`fav-${h.id}`]: !prev[`fav-${h.id}`] }))}
                >
                  <ProductName>
                    {r.product_name || 'Produit'}
                    <InlineHint>(100g)</InlineHint>
                  </ProductName>
                </TouchableOpacity>
              </LeftRow>
              <Value>{kcal !== null ? `${kcal} kcal` : '—'}</Value>
            </HeaderRow>
            {isOpen && (
              <>
                <Row style={{ justifyContent: 'space-between' }}>
                  <Label>Lipides</Label>
                  <Value>{fat !== null ? `${fat} g` : '—'}</Value>
                </Row>
                <Row style={{ justifyContent: 'space-between' }}>
                  <Label>Sucres</Label>
                  <Value>{sugars !== null ? `${sugars} g` : '—'}</Value>
                </Row>
                <Row style={{ justifyContent: 'space-between' }}>
                  <Label>Protéines</Label>
                  <Value>{proteins !== null ? `${proteins} g` : '—'}</Value>
                </Row>
                <Row style={{ justifyContent: 'space-between' }}>
                  <Button onPress={() => saveResult(r)} activeOpacity={0.8}>
                    <ButtonText>Enregistrer</ButtonText>
                  </Button>
                </Row>
              </>
            )}
          </Card>
        );
      })}

      {history.filter(h => h.item !== result).slice(0, 5).length > 0 && (
        <Hint style={{ marginTop: 12 }}>Récents</Hint>
      )}

      {history
        .filter(h => h.item !== result)
        .slice(0, 5)
        .map(h => {
          const r = h.item;
          const n: Nutriments | undefined = r.nutriments;
          const fat = n?.fat_100g ?? null;
          const sugars = n?.sugars_100g ?? null;
          const proteins = n?.proteins_100g ?? null;
          const kcal = (n as any)?.['energy-kcal_100g'] ?? (n as any)?.energy_kcal_100g ?? null;
          const isOpen = !!expanded[h.id];
          return (
            <Card key={h.id}>
              <HeaderRow>
                <LeftRow>
                  <TouchableOpacity onPress={() => toggleFavorite(h)}>
                    {favorites.some(f => f.item.product_name === r.product_name) ? (
                      <Heart active>♥</Heart>
                    ) : (
                      <Heart>♡</Heart>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={{ flex: 1 }} 
                    onPress={() => toggleExpand(h.id)}
                  >
                    <ProductName>
                      {r.product_name || 'Produit'}
                      <InlineHint>(100g)</InlineHint>
                    </ProductName>
                  </TouchableOpacity>
                </LeftRow>
                <Value>{kcal !== null ? `${kcal} kcal` : '—'}</Value>
              </HeaderRow>
              {isOpen && (
                <>
                  <Row style={{ justifyContent: 'space-between' }}>
                    <Label>Lipides</Label>
                    <Value>{fat !== null ? `${fat} g` : '—'}</Value>
                  </Row>
                  <Row style={{ justifyContent: 'space-between' }}>
                    <Label>Sucres</Label>
                    <Value>{sugars !== null ? `${sugars} g` : '—'}</Value>
                  </Row>
                  <Row style={{ justifyContent: 'space-between' }}>
                    <Label>Protéines</Label>
                    <Value>{proteins !== null ? `${proteins} g` : '—'}</Value>
                  </Row>
                  <Button onPress={() => saveResult(r)} activeOpacity={0.8}>
                    <ButtonText>Enregistrer</ButtonText>
                  </Button>
                </>
              )}
            </Card>
          );
        })}
      </ScrollView>
    </>
  );
}


