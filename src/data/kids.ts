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

const KIDS_SIZES = ['4Y', '6Y', '8Y', '10Y'];

// Belts
import b1 from '@/assets/img/kids/Belts/b1.jfif';
import b2 from '@/assets/img/kids/Belts/b2.jfif';
import b3 from '@/assets/img/kids/Belts/b3.jfif';
import b4 from '@/assets/img/kids/Belts/b4.jfif';
import b5 from '@/assets/img/kids/Belts/b5.jfif';

// Caps & Hats
import cap4 from '@/assets/img/kids/Caps_Hats/download4.jfif';
import cap5 from '@/assets/img/kids/Caps_Hats/download5.jfif';
import cap6 from '@/assets/img/kids/Caps_Hats/download6.jfif';
import cap10 from '@/assets/img/kids/Caps_Hats/download10.jfif';
import cap11 from '@/assets/img/kids/Caps_Hats/download11.jfif';

// FootWear
import booties from '@/assets/img/kids/FootWear/booties.webp';
import girlSandals from '@/assets/img/kids/FootWear/girl_sandals.jpg';
import girlShoes from '@/assets/img/kids/FootWear/girl_shoes.webp';
import product from '@/assets/img/kids/FootWear/product.jpg';
import pumpsShoes from '@/assets/img/kids/FootWear/pumps_shoes.jpg';

// Hoodies & Sweaters
import kh1 from '@/assets/img/kids/Hoodies_Sweaters/download2.jfif';
import kh2 from '@/assets/img/kids/Hoodies_Sweaters/download6.jfif';
import kh3 from '@/assets/img/kids/Hoodies_Sweaters/download7.jfif';
import kh4 from '@/assets/img/kids/Hoodies_Sweaters/images5.jfif';
import kh5 from '@/assets/img/kids/Hoodies_Sweaters/images.jfif';

// Jackets & Coats
import kj1 from '@/assets/img/kids/Jackets_Coats/download4.jfif';
import kj2 from '@/assets/img/kids/Jackets_Coats/download5.jfif';
import kj3 from '@/assets/img/kids/Jackets_Coats/download6.jfif';
import kj4 from '@/assets/img/kids/Jackets_Coats/download7.jfif';
import kj5 from '@/assets/img/kids/Jackets_Coats/images6.jfif';

// Shirts
import ks1 from '@/assets/img/kids/Shirts/download4.jfif';
import ks2 from '@/assets/img/kids/Shirts/download5.jfif';
import ks3 from '@/assets/img/kids/Shirts/images7.jfif';
import ks4 from '@/assets/img/kids/Shirts/images8.jfif';
import ks5 from '@/assets/img/kids/Shirts/images9.jfif';

// Shorts
import ksh1 from '@/assets/img/kids/Shorts/download6.jfif';
import ksh2 from '@/assets/img/kids/Shorts/download7.jfif';
import ksh3 from '@/assets/img/kids/Shorts/images4.jfif';
import ksh4 from '@/assets/img/kids/Shorts/images5.jfif';
import ksh5 from '@/assets/img/kids/Shorts/images6.jfif';

// Suits & Tailoring
import kst1 from '@/assets/img/kids/Suits_Tailoring/download.jfif';
import kst2 from '@/assets/img/kids/Suits_Tailoring/images1.jfif';
import kst3 from '@/assets/img/kids/Suits_Tailoring/images2.jfif';
import kst4 from '@/assets/img/kids/Suits_Tailoring/images3.jfif';
import kst5 from '@/assets/img/kids/Suits_Tailoring/images.jfif';

// Tshirts
import kt1 from '@/assets/img/kids/Tshirts/download5.jfif';
import kt2 from '@/assets/img/kids/Tshirts/download6.jfif';
import kt3 from '@/assets/img/kids/Tshirts/images6.jfif';
import kt4 from '@/assets/img/kids/Tshirts/images7.jfif';
import kt5 from '@/assets/img/kids/Tshirts/images8.jfif';

// Underwear
import ku1 from '@/assets/img/kids/Underwear/download7.jfif';
import ku2 from '@/assets/img/kids/Underwear/download8.jfif';
import ku3 from '@/assets/img/kids/Underwear/download9.jfif';
import ku4 from '@/assets/img/kids/Underwear/download10.jfif';
import ku5 from '@/assets/img/kids/Underwear/images4.jfif';

// Waistcoats
import kw1 from '@/assets/img/kids/WaistCoats/download1.jfif';
import kw2 from '@/assets/img/kids/WaistCoats/download2.jfif';
import kw3 from '@/assets/img/kids/WaistCoats/download3.jfif';
import kw4 from '@/assets/img/kids/WaistCoats/download4.jfif';
import kw5 from '@/assets/img/kids/WaistCoats/download.jfif';

// Jeans
import kjn1 from '@/assets/img/kids/Jeans/bottom_wear.jpeg';
import kjn2 from '@/assets/img/kids/Jeans/download3.jfif';
import kjn3 from '@/assets/img/kids/Jeans/download.jfif';
import kjn4 from '@/assets/img/kids/Jeans/images.jfif';
import kjn5 from '@/assets/img/kids/Jeans/pamper_pants.jpeg';

export const kidsProducts: Product[] = [
  ...createProducts('kids', 'Belts', [b1,b2,b3,b4,b5], 'Kids Belt', ['S','M','L'], 800),
  ...createProducts('kids', 'Caps_Hats', [cap4,cap5,cap6,cap10,cap11], 'Kids Cap/Hat', KIDS_SIZES, 700),
  ...createProducts('kids', 'FootWear', [booties,girlSandals,girlShoes,product,pumpsShoes], 'Kids Footwear', KIDS_SIZES, 950),
  ...createProducts('kids', 'Hoodies_Sweaters', [kh1,kh2,kh3,kh4,kh5], 'Kids Hoodie', KIDS_SIZES, 800),
  ...createProducts('kids', 'Jackets_Coats', [kj1,kj2,kj3,kj4,kj5], 'Kids Jacket/Coat', KIDS_SIZES, 1200),
  ...createProducts('kids', 'Shirts', [ks1,ks2,ks3,ks4,ks5], 'Kids Shirt', KIDS_SIZES, 900),
  ...createProducts('kids', 'Shorts', [ksh1,ksh2,ksh3,ksh4,ksh5], 'Kids Shorts', KIDS_SIZES, 850),
  ...createProducts('kids', 'Suits_Tailoring', [kst1,kst2,kst3,kst4,kst5], 'Kids Suit', KIDS_SIZES, 1800),
  ...createProducts('kids', 'Tshirts', [kt1,kt2,kt3,kt4,kt5], 'Kids T-Shirt', KIDS_SIZES, 700),
  ...createProducts('kids', 'Underwear', [ku1,ku2,ku3,ku4,ku5], 'Kids Underwear', KIDS_SIZES, 500),
  ...createProducts('kids', 'WaistCoats', [kw1,kw2,kw3,kw4,kw5], 'Kids WaistCoat', KIDS_SIZES, 1100),
  ...createProducts('kids', 'Jeans', [kjn1,kjn2,kjn3,kjn4,kjn5], 'Kids Jeans', KIDS_SIZES, 950),
];