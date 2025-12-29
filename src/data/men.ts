// src/data/products/women.ts
import { Product } from './types';

const createProducts = (
  department: 'men' | 'women' | 'kids',
  subcategory: string,
  images: string[],
  nameBase: string,
  sizes: string[],
  basePrice: number
): Product[] =>
  images.map((img, idx) => ({
    id: `${department}-${subcategory.toLowerCase()}-${idx + 1}`,
    name: `${nameBase} #${idx + 1}`,
    price: basePrice,
    category: department,
    subcategory,
    sizes,
    image: img,
    stock: 10,
  }));

const WOMEN_SIZES = ['XS', 'S', 'M', 'L', 'XL'];

// Belts
import wBelts1 from '@/assets/img/women/Belts/download1.jfif';
import wBelts2 from '@/assets/img/women/Belts/download2.jfif';
import wBelts3 from '@/assets/img/women/Belts/download3.jfif';
import wBelts4 from '@/assets/img/women/Belts/download4.jfif';
import wBelts5 from '@/assets/img/women/Belts/download.jfif';

// Caps & Hats
import wCaps1 from '@/assets/img/women/Caps_Hats/cap.jpg';
import wCaps2 from '@/assets/img/women/Caps_Hats/cowboy.png';
import wCaps3 from '@/assets/img/women/Caps_Hats/download1.jfif';
import wCaps4 from '@/assets/img/women/Caps_Hats/download2.jfif';
import wCaps5 from '@/assets/img/women/Caps_Hats/images.jfif';

// FootWear
import wFoot1 from '@/assets/img/women/FootWear/img14.jpg';
import wFoot2 from '@/assets/img/women/FootWear/img16.jpg';
import wFoot3 from '@/assets/img/women/FootWear/img17.jpg';
import wFoot4 from '@/assets/img/women/FootWear/item6.jpeg';
import wFoot5 from '@/assets/img/women/FootWear/product.jpg';

// Hoodies & Sweaters
import wHood1 from '@/assets/img/women/Hoodies_Sweaters/download1.jfif';
import wHood2 from '@/assets/img/women/Hoodies_Sweaters/download5.jfif';
import wHood3 from '@/assets/img/women/Hoodies_Sweaters/download.jfif';
import wHood4 from '@/assets/img/women/Hoodies_Sweaters/gingham.jpg';
import wHood5 from '@/assets/img/women/Hoodies_Sweaters/images1.jfif';

// Jackets & Coats
import wJacket1 from '@/assets/img/women/Jackets_Coats/download1.jfif';
import wJacket2 from '@/assets/img/women/Jackets_Coats/download2.jfif';
import wJacket3 from '@/assets/img/women/Jackets_Coats/images.jfif';
import wJacket4 from '@/assets/img/women/Jackets_Coats/item1.jpeg';
import wJacket5 from '@/assets/img/women/Jackets_Coats/item2.jpeg';

// Shirts
import wShirt1 from '@/assets/img/women/Shirts/download1.jfif';
import wShirt2 from '@/assets/img/women/Shirts/download2.jfif';
import wShirt3 from '@/assets/img/women/Shirts/download.jfif';
import wShirt4 from '@/assets/img/women/Shirts/images1.jfif';
import wShirt5 from '@/assets/img/women/Shirts/images.jfif';

// Shorts
import wShort1 from '@/assets/img/women/Shorts/download1.jfif';
import wShort2 from '@/assets/img/women/Shorts/download2.jfif';
import wShort3 from '@/assets/img/women/Shorts/download.jfif';
import wShort4 from '@/assets/img/women/Shorts/images1.jfif';
import wShort5 from '@/assets/img/women/Shorts/images.jfif';

// Suits & Tailoring
import wSuit1 from '@/assets/img/women/Suits_Tailoring/cloth19.jpeg';
import wSuit2 from '@/assets/img/women/Suits_Tailoring/cloth20.jpeg';
import wSuit3 from '@/assets/img/women/Suits_Tailoring/download3.jfif';
import wSuit4 from '@/assets/img/women/Suits_Tailoring/images9.jfif';
import wSuit5 from '@/assets/img/women/Suits_Tailoring/img24.jpg';

// Tshirts
import wTee1 from '@/assets/img/women/Tshirts/boy.jpg';
import wTee2 from '@/assets/img/women/Tshirts/cloth2.jpeg';
import wTee3 from '@/assets/img/women/Tshirts/download1.jfif';
import wTee4 from '@/assets/img/women/Tshirts/images1.jfif';
import wTee5 from '@/assets/img/women/Tshirts/images.jfif';

// Underwear
import wUnder1 from '@/assets/img/women/Underwear/download1.jfif';
import wUnder2 from '@/assets/img/women/Underwear/download2.jfif';
import wUnder3 from '@/assets/img/women/Underwear/download3.jfif';
import wUnder4 from '@/assets/img/women/Underwear/download4.jfif';
import wUnder5 from '@/assets/img/women/Underwear/images.jfif';

// Waistcoats
import wWaist1 from '@/assets/img/women/WaistCoats/download7.jfif';
import wWaist2 from '@/assets/img/women/WaistCoats/download8.jfif';
import wWaist3 from '@/assets/img/women/WaistCoats/download9.jfif';
import wWaist4 from '@/assets/img/women/WaistCoats/download10.jfif';
import wWaist5 from '@/assets/img/women/WaistCoats/download11.jfif';

// Jeans
import wJeans1 from '@/assets/img/women/Jeans/download7.jfif';
import wJeans2 from '@/assets/img/women/Jeans/download8.jfif';
import wJeans3 from '@/assets/img/women/Jeans/download9.jfif';
import wJeans4 from '@/assets/img/women/Jeans/images3.jfif';
import wJeans5 from '@/assets/img/women/Jeans/item3.jpeg';

export const menProducts: Product[] = [
  ...createProducts('men', 'Belts', [wBelts1,wBelts2,wBelts3,wBelts4,wBelts5], 'men Belt', WOMEN_SIZES, 4),
  ...createProducts('men', 'Caps_Hats', [wCaps1,wCaps2,wCaps3,wCaps4,wCaps5], 'men Cap/Hat', WOMEN_SIZES, 3),
  ...createProducts('men', 'FootWear', [wFoot1,wFoot2,wFoot3,wFoot4,wFoot5], 'men Footwear', WOMEN_SIZES, 2),
  ...createProducts('men', 'Hoodies_Sweaters', [wHood1,wHood2,wHood3,wHood4,wHood5], 'men Hoodie', WOMEN_SIZES, 12),
  ...createProducts('men', 'Jackets_Coats', [wJacket1,wJacket2,wJacket3,wJacket4,wJacket5], 'men Jacket/Coat', WOMEN_SIZES, 19),
  ...createProducts('men', 'Shirts', [wShirt1,wShirt2,wShirt3,wShirt4,wShirt5], 'men Shirt', WOMEN_SIZES, 15),
  ...createProducts('men', 'Shorts', [wShort1,wShort2,wShort3,wShort4,wShort5], 'men Shorts', WOMEN_SIZES, 5),
  ...createProducts('men', 'Suits_Tailoring', [wSuit1,wSuit2,wSuit3,wSuit4,wSuit5], 'men Suit', WOMEN_SIZES, 32),
  ...createProducts('men', 'Tshirts', [wTee1,wTee2,wTee3,wTee4,wTee5], 'men T-Shirt', WOMEN_SIZES, 7),
  ...createProducts('men', 'Underwear', [wUnder1,wUnder2,wUnder3,wUnder4,wUnder5], 'men Underwear', WOMEN_SIZES, 2),
  ...createProducts('men', 'WaistCoats', [wWaist1,wWaist2,wWaist3,wWaist4,wWaist5], 'men WaistCoat', WOMEN_SIZES, 10),
  ...createProducts('men', 'Jeans', [wJeans1,wJeans2,wJeans3,wJeans4,wJeans5], 'men Jeans', WOMEN_SIZES, 20),
];