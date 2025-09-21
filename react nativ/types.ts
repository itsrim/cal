export type Nutriments = {
  fat_100g?: number;
  sugars_100g?: number;
  proteins_100g?: number;
  'energy-kcal_100g'?: number;
  energy_kcal_100g?: number;
  [key: string]: unknown;
};

export type SearchResult = {
  product_name?: string;
  nutriments?: Nutriments;
};

export type SavedItem = {
  id: string;
  product_name: string;
  nutriments: Nutriments;
  timestamp: number;
  quantity?: number; // en grammes, défaut 100
};

export type RecentEntry = {
  id: string;
  item: SearchResult;
};

export type FavoriteEntry = {
  id: string;
  item: SearchResult;
};


