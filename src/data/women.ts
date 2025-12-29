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

const MEN_SIZES = ['S', 'M', 'L', 'XL'];

// Belts
import mb1 from '@/assets/img/men/Belts/download5.jfif';
import mb2 from '@/assets/img/men/Belts/download6.jfif';
import mb3 from '@/assets/img/men/Belts/images1.jfif';
import mb4 from '@/assets/img/men/Belts/images2.jfif';
import mb5 from '@/assets/img/men/Belts/images.jfif';

// Caps & Hats
import mc1 from '@/assets/img/men/Caps_Hats/images2.jfif';
import mc2 from '@/assets/img/men/Caps_Hats/images3.jfif';
import mc3 from '@/assets/img/men/Caps_Hats/images4.jfif';
import mc4 from '@/assets/img/men/Caps_Hats/images5.jfif';
import mc5 from '@/assets/img/men/Caps_Hats/images6.jfif';

// FootWear
import mf1 from '@/assets/img/men/FootWear/boy_sneakers.jpeg';
import mf2 from '@/assets/img/men/FootWear/high_heels.jpeg';
import mf3 from '@/assets/img/men/FootWear/sandal1.jpg';
import mf4 from '@/assets/img/men/FootWear/sandal5.jpg';
import mf5 from '@/assets/img/men/FootWear/toodler.jpg';

// Hoodies & Sweaters
import mh1 from '@/assets/img/men/Hoodies_Sweaters/download3.jfif';
import mh2 from '@/assets/img/men/Hoodies_Sweaters/download4.jfif';
import mh3 from '@/assets/img/men/Hoodies_Sweaters/images2.jfif';
import mh4 from '@/assets/img/men/Hoodies_Sweaters/images3.jfif';
import mh5 from '@/assets/img/men/Hoodies_Sweaters/images4.jfif';

// Jackets & Coats
import mj1 from '@/assets/img/men/Jackets_Coats/download3.jfif';
import mj2 from '@/assets/img/men/Jackets_Coats/images2.jfif';
import mj3 from '@/assets/img/men/Jackets_Coats/images3.jfif';
import mj4 from '@/assets/img/men/Jackets_Coats/images4.jfif';
import mj5 from '@/assets/img/men/Jackets_Coats/images5.jfif';

// Shirts
import ms1 from '@/assets/img/men/Shirts/images2.jfif';
import ms2 from '@/assets/img/men/Shirts/images3.jfif';
import ms3 from '@/assets/img/men/Shirts/images4.jfif';
import ms4 from '@/assets/img/men/Shirts/images5.jfif';
import ms5 from '@/assets/img/men/Shirts/images6.jfif';

// Shorts
import msh1 from '@/assets/img/men/Shorts/download3.jfif';
import msh2 from '@/assets/img/men/Shorts/download4.jfif';
import msh3 from '@/assets/img/men/Shorts/download5.jfif';
import msh4 from '@/assets/img/men/Shorts/images2.jfif';
import msh5 from '@/assets/img/men/Shorts/images3.jfif';

// Suits & Tailoring
import mst1 from '@/assets/img/men/Suits_Tailoring/download1.jfif';
import mst2 from '@/assets/img/men/Suits_Tailoring/images4.jfif';
import mst3 from '@/assets/img/men/Suits_Tailoring/images5.jfif';
import mst4 from '@/assets/img/men/Suits_Tailoring/images6.jfif';
import mst5 from '@/assets/img/men/Suits_Tailoring/images8.jfif';

// Tshirts
import mt1 from '@/assets/img/men/Tshirts/download2.jfif';
import mt2 from '@/assets/img/men/Tshirts/download3.jfif';
import mt3 from '@/assets/img/men/Tshirts/images3.jfif';
import mt4 from '@/assets/img/men/Tshirts/images4.jfif';
import mt5 from '@/assets/img/men/Tshirts/images5.jfif';

// Underwear
import mu1 from '@/assets/img/men/Underwear/download5.jfif';
import mu2 from '@/assets/img/men/Underwear/download6.jfif';
import mu3 from '@/assets/img/men/Underwear/images1.jfif';
import mu4 from '@/assets/img/men/Underwear/images3.jfif';

// Waistcoats
import mw1 from '@/assets/img/men/WaistCoats/download5.jfif';
import mw2 from '@/assets/img/men/WaistCoats/images1.jfif';
import mw3 from '@/assets/img/men/WaistCoats/images2.jfif';
import mw4 from '@/assets/img/men/WaistCoats/images3.jfif';
import mw5 from '@/assets/img/men/WaistCoats/images.jfif';

// Jeans
import mjn1 from '@/assets/img/men/Jeans/download4.jfif';
import mjn2 from '@/assets/img/men/Jeans/download5.jfif';
import mjn3 from '@/assets/img/men/Jeans/download6.jfif';
import mjn4 from '@/assets/img/men/Jeans/download11.jfif';
import mjn5 from '@/assets/img/men/Jeans/images2.jfif';

export const womenProducts: Product[] = [
  ...createProducts('women', 'Belts', [mb1,mb2,mb3,mb4,mb5], 'Women Belt', MEN_SIZES, 3),
  ...createProducts('women', 'Caps_Hats', [mc1,mc2,mc3,mc4,mc5], 'Women Cap/Hat', MEN_SIZES, 3),
  ...createProducts('women', 'FootWear', [mf1,mf2,mf3,mf4,mf5], 'Women Footwear', MEN_SIZES, 2),
  ...createProducts('women', 'Hoodies_Sweaters', [mh1,mh2,mh3,mh4,mh5], 'Women Hoodie', MEN_SIZES, 13),
  ...createProducts('women', 'Jackets_Coats', [mj1,mj2,mj3,mj4,mj5], 'Women Jacket/Coat', MEN_SIZES, 18),
  ...createProducts('women', 'Shirts', [ms1,ms2,ms3,ms4,ms5], 'Women Shirt', MEN_SIZES, 10),
  ...createProducts('women', 'Shorts', [msh1,msh2,msh3,msh4,msh5], 'Women Shorts', MEN_SIZES, 6),
  ...createProducts('women', 'Suits_Tailoring', [mst1,mst2,mst3,mst4,mst5], 'Women Suit', MEN_SIZES, 30),
  ...createProducts('women', 'Tshirts', [mt1,mt2,mt3,mt4,mt5], 'Women T-Shirt', MEN_SIZES, 5),
  ...createProducts('women', 'Underwear', [mu1,mu2,mu3,mu4], 'Women Underwear', MEN_SIZES, 4),
  ...createProducts('women', 'WaistCoats', [mw1,mw2,mw3,mw4,mw5], 'Women WaistCoat', MEN_SIZES, 9),
  ...createProducts('women', 'Jeans', [mjn1,mjn2,mjn3,mjn4,mjn5], 'Women Jeans', MEN_SIZES, 13),
];