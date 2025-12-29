// src/data/products/types.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'men' | 'women' | 'kids';
  subcategory: string;
  sizes: string[];
  image: string;
  featured?: boolean;
  stock: number,
}