export type OFFProduct = {
  product_name?: string;
  nutriments?: Record<string, number>;
  nutriscore_grade?: string;
};

export const fetchProductByBarcode = async (ean: string) => {
  const url = `https://world.openfoodfacts.org/api/v2/product/${ean}.json?fields=product_name,nutriments,nutriscore_grade`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const data = await res.json();
  const p: OFFProduct | undefined = data?.product;
  if (!p) {
    throw new Error("Produit introuvable");
  }
  return p;
};
