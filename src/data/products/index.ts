import { Product } from '../types';
import { menProducts } from '../men';
import { womenProducts } from '../women';
import { kidsProducts } from '../kids';

// 1. Combine the static files
const staticProducts: Product[] = [
  ...menProducts,
  ...womenProducts,
  ...kidsProducts,
];

// 2. ⭐ THE KEY FIX: Create a helper to get the "Live" version of products
const getLiveProducts = (): Product[] => {
  const saved = localStorage.getItem('glamour_inventory');
  if (saved) {
    const localInventory = JSON.parse(saved);
    // Merge static data with local stock levels to ensure all fields exist
    return staticProducts.map(staticP => {
      const liveP = localInventory.find((lp: any) => String(lp.id) === String(staticP.id));
      return liveP ? liveP : { ...staticP, stock: staticP.stock ?? 0 };
    });
  }
  return staticProducts.map(p => ({ ...p, stock: p.stock ?? 0 }));
};

export const products = getLiveProducts();

// Get single product - updated to use live data
export const getProductById = (id: string): Product | undefined =>
  getLiveProducts().find(p => String(p.id) === String(id));

// ⭐ MAIN FILTER FUNCTION
export const getProducts = (
  department: 'men' | 'women' | 'kids' | 'all',
  subcategory: string | 'all'
): Product[] => {
  const normalizedSub = subcategory.toLowerCase();
  const liveInventory = getLiveProducts(); // Always fetch fresh stock

  let filtered = liveInventory.filter(p =>
    (department === 'all' || p.category === department) &&
    (subcategory === 'all' || p.subcategory.toLowerCase() === normalizedSub)
  );

  return filtered.map(p => {
    let finalProduct = { ...p };

    // Apply men↔women swap ONLY when department is 'all'
    if (department === 'all') {
      if (p.category === 'men') {
        return { ...finalProduct, category: 'women' };
      }
      if (p.category === 'women') {
        return { ...finalProduct, category: 'men' };
      }
    }

    return finalProduct;
  });
};