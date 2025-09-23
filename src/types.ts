export type Nutriments = {
  fat_100g?: number | null;
  sugars_100g?: number | null;
  proteins_100g?: number | null;
  // parfois energy est "energy-kcal_100g" ou "energy_kcal_100g"
  ["energy-kcal_100g"]?: number | null;
  energy_kcal_100g?: number | null;
  [key: string]: any;
};

export type SearchResult = {
  product_name?: string;
  nutriments?: Nutriments;
  nutriscore_grade?: string;
};

export type SavedItem = {
  id: string;
  product_name: string;
  nutriments: Nutriments;
  timestamp: number;
  quantity?: number;
  nutriscore_grade?: string; 
};

export type RecentEntry = {
  id: string;
  item: SearchResult;
};

export type FavoriteEntry = {
  id: string;
  item: SearchResult;
};
