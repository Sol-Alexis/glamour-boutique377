import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import heroImage from '@/assets/hero-fashion.png';
import './Categories.css';
import './Filters.css';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Search as SearchIcon } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product, getProducts } from '@/data/products';
import { useToast } from '@/hooks/use-toast';

interface IndexProps {
  department?: 'men' | 'women' | 'kids' | 'all';
}

const Index = ({ department = 'all' }: IndexProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  /* ---------------- STATE ---------------- */
  const [currentDepartment, setCurrentDepartment] =
    useState<'men' | 'women' | 'kids' | 'all'>(department);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const categoriesRef = useRef<HTMLDivElement | null>(null);
  const filtersRef = useRef<HTMLDivElement | null>(null);

  const { addToCart, items } = useCart();
  const { toast } = useToast();

  /* ---------------- DATA MERGING (FIXED) ---------------- */
  const getAllCurrentProducts = (dept: string, cat: string): Product[] => {
    // 1. Get initial static products
    const staticProducts = getProducts(dept as any, cat);
    
    // 2. Get local products from Admin
    const localData = localStorage.getItem('glamour_inventory');
    const localProducts: Product[] = localData ? JSON.parse(localData) : [];

    // 3. Filter local products with the same logic as the shop
    const filteredLocal = localProducts.filter(p => {
      const pDept = (p.department || 'all').toLowerCase();
      const pCat = (p.category || '').toLowerCase();
      const pSubCat = (p.subcategory || '').toLowerCase(); 
      
      const targetDept = dept.toLowerCase();
      const targetCat = cat.toLowerCase();

      const deptMatch = targetDept === 'all' || pDept === targetDept;
      
      // Matches if clicking "All" or if category/subcategory matches the selection
      const catMatch = targetCat === 'all' || pCat === targetCat || pSubCat === targetCat;

      return deptMatch && catMatch;
    });

    // 4. Merge them and ensure no duplicate IDs (Admin edits overwrite static)
    const allMerged = [...filteredLocal, ...staticProducts];
    const uniqueMap = new Map();
    
    allMerged.forEach(item => {
      if (!uniqueMap.has(item.id)) {
        uniqueMap.set(item.id, item);
      }
    });

    return Array.from(uniqueMap.values());
  };

  /* ---------------- FILTERS ---------------- */
  const filters = {
    Size: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    Color: ['Black', 'White', 'Grey', 'Blue', 'Red', 'Green', 'Yellow', 'Brown'],
  };

  /* ---------------- RESET ---------------- */
  const resetPageState = () => {
    setSelectedCategory(null);
    setDisplayedProducts([]);
    setSelectedProduct(null);
    setSelectedSize('');
    setSelectedColor('');
    setOpenFilter(null);
  };

  useEffect(() => {
    const handleReset = () => {
      setCurrentDepartment('all');
      resetPageState();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('glamourReset', handleReset);
    return () => window.removeEventListener('glamourReset', handleReset);
  }, []);

  /* ---------------- DEPARTMENT CHANGE ---------------- */
  useEffect(() => {
    setCurrentDepartment(department);
    resetPageState();
    categoriesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [department]);

  /* ---------------- HANDLE QUERY PARAM FROM SHOPLANDING ---------------- */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const dept = params.get('department') as 'men' | 'women' | 'kids' | null;

    if (dept) {
      setCurrentDepartment(dept);
      setSelectedCategory(null);
      setSelectedProduct(null);
      setSelectedSize('');
      setSelectedColor('');
      setOpenFilter(null);

      setLoading(true);
      setTimeout(() => {
        const allProductsForDept = getAllCurrentProducts(dept, 'all');
        setDisplayedProducts(allProductsForDept);
        setLoading(false);
      }, 300);

      categoriesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.search]);

/* ---------------- HANDLE SEARCH & DIRECT PRODUCT SELECTION (FIXED) ---------------- */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('search')?.toLowerCase() || '';
    const directProductId = params.get('productId'); 

    if (directProductId) {
      const allProducts = getAllCurrentProducts('all', 'all');
      const targetProduct = allProducts.find(p => p.id.toString() === directProductId);
      
      if (targetProduct) {
        const safeDept = (targetProduct.department || 'all') as any;
        setCurrentDepartment(safeDept);
        setSelectedCategory(targetProduct.category);
        setDisplayedProducts(getAllCurrentProducts(safeDept, targetProduct.category));
        setSelectedProduct(targetProduct); 
        
        setTimeout(() => {
          filtersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
      }
    } 
    else if (searchQuery) {
      // Get all inventory (Static + Local)
      const allProducts = getAllCurrentProducts('all', 'all');
      
      const filtered = allProducts.filter((p) => {
        const nameMatch = (p.name || "").toLowerCase().includes(searchQuery);
        const catMatch = (p.category || "").toLowerCase().includes(searchQuery);
        const subCatMatch = (p.subcategory || "").toLowerCase().includes(searchQuery);
        
        return nameMatch || catMatch || subCatMatch;
      });

      setDisplayedProducts(filtered);
      setSelectedCategory('Search Results'); 
      setCurrentDepartment('all');
      
      setTimeout(() => {
        categoriesRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } 
    else {
      /* THIS IS THE FIX: 
         If there is NO search query and NO productId in the URL, 
         we must force the results and the text to be BLANK.
      */
      setDisplayedProducts([]);
      if (selectedCategory === 'Search Results') {
        setSelectedCategory(null);
      }
    }
  }, [location.search]);

  /* ---------------- GLAMOUR RESET ---------------- */
  useEffect(() => {
    if (location.pathname === '/') {
      setCurrentDepartment('all');
      resetPageState();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname]);

  /* ---------------- CATEGORY CLICK ---------------- */
  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      resetPageState();
      return;
    }
  setOpenFilter(null);
    setSelectedCategory(category);
    setLoading(true);
    setTimeout(() => {
      setDisplayedProducts(getAllCurrentProducts(currentDepartment, category));
      setSelectedProduct(null);
      setSelectedSize('');
      setSelectedColor('');
      setLoading(false);
    }, 300);

    categoriesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /* ---------------- PRODUCT CLICK ---------------- */
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize('');
    setSelectedColor('');
    setOpenFilter(null);

    setTimeout(() => {
      if (filtersRef.current) {
        filtersRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100); 
  };

  /* ---------------- CART ACTIONS ---------------- */
const handleBuyNow = () => {
    // We use 'selectedProduct' because that is what you defined in your state
    if (!selectedProduct) {
      console.error("No product found to purchase");
      return;
    }

    // Check Stock
    const stockLimit = selectedProduct.stock ?? 10;
    if (stockLimit <= 0) {
      toast({
        variant: "destructive",
        title: "Out of Stock",
        description: "This item is currently unavailable."
      });
      return;
    }

    // Use addToCart with the 4 arguments your CartContext expects
    addToCart(
      selectedProduct, 
      selectedSize || "M", 
      selectedColor || "Default", 
      1
    );

    navigate('/checkout');
    window.scrollTo(0, 0);
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    const targetSize = selectedSize || "Standard";
    const targetColor = selectedColor || "Original";

    const itemInCart = items.find(
      (item) => 
        String(item.product.id) === String(selectedProduct.id) && 
        item.size === targetSize
    );

    const currentQty = itemInCart ? itemInCart.quantity : 0;
    const availableStock = selectedProduct.stock ?? 10;

    if (currentQty >= availableStock) {
      alert(`Limit reached! You already have ${currentQty} units of this item in your cart.`);
      return;
    }

    addToCart(selectedProduct, targetSize, targetColor, 1);
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ---------------- CATEGORY LIST ---------------- */
  const categories = [
    'Belts',
    'Caps_Hats',
    'FootWear',
    'Hoodies_Sweaters',
    'Jackets_Coats',
    'Jeans',
    'Shirts',
    'Shorts',
    'Suits_Tailoring',
    'Tshirts',
    'Underwear',
    'WaistCoats',
  ];

  return (
  <Layout>
    {/* HERO - Fixed Width & Height logic */}
    <section className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden block">
      <img 
        src={heroImage} 
        alt="Hero" 
        className="w-full h-full object-cover block" 
        /* Removed 'absolute inset-0' to let the image define the section's solid presence */
      />
      <div className="absolute inset-0 bg-black/20" />
    </section>

    {/* CATEGORIES SECTION - Added pt-20 here to protect against the Header */}
    <section ref={categoriesRef} className="categories-section pt-20">
      <h2 className="categories-title">
        {(!currentDepartment || currentDepartment === 'all')
          ? 'ALL CATEGORIES'
          : `${currentDepartment.toUpperCase()} CATEGORIES`}
      </h2>

      <div className="categories-grid">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`category-card ${
              selectedCategory === cat ? 'category-active' : ''
            }`}
          >
            <p className="category-name">{cat.replace('_', ' & ')}</p>
          </button>
        ))}
      </div>
    </section>
   {/* PRODUCTS GRID */}
{selectedCategory && (
  <section className="products-section">
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '2rem',
        padding: '2rem',
        maxWidth: '1300px',
        margin: '0 auto',
      }}
    >
      {/* 1. Loading State: col-span-full ensures it doesn't break the first slot */}
      {loading && (
        <p className="col-span-full text-center py-10">Loading products...</p>
      )}

      {/* 2. Empty State: col-span-full prevents it from occupying a single card slot */}
      {!loading && displayedProducts.length === 0 && !selectedProduct && (
        <p className="col-span-full text-center py-10">No products found for this category.</p>
      )}

      {/* 3. Product Mapping: Only renders when products exist */}
      {!loading && displayedProducts.length > 0 && 
        displayedProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => handleProductClick(product)}
            className="product-card group"
          >
            <div className="product-image-wrapper">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover cursor-zoom-in transition-all duration-500 group-hover:scale-110 group-hover:brightness-90"
              />
            </div>
            <h3 className="text-sm font-medium mt-2">{product.name}</h3>
            <p className="text-sm text-muted-foreground">
              {(product.price * 150).toLocaleString()} ETB
            </p>
          </div>
        ))
      }
    </div>
  </section>
)}

      {/* SELECTED PRODUCT DETAIL VIEW */}
      {selectedProduct && (
        <section ref={filtersRef} className="selected-product-view animate-in fade-in duration-500 py-16 border-t">
          <div className="product-focus-container flex flex-col gap-12 p-8 max-w-[1200px] mx-auto bg-white/50 backdrop-blur-sm rounded-3xl">
            
            {/* LARGE PRODUCT IMAGE */}
            <div className="w-full flex justify-center">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name} 
                style={{ 
                  transform: selectedSize === 'XL' || selectedSize === 'XXL' ? 'scale(1.1)' : 
                             selectedSize === 'XS' || selectedSize === 'S' ? 'scale(0.9)' : 'scale(1)' 
                }}
                className="w-full max-w-[500px] h-auto rounded-2xl shadow-2xl object-cover transition-transform duration-500" 
              />
            </div>

            {/* INFO */}
            <div className="text-center">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{(selectedProduct.category || '').replace('_', ' & ')}</span>
              <h2 className="text-4xl font-serif mt-2 mb-2">{selectedProduct.name}</h2>
              <p className="text-2xl font-light">{(selectedProduct.price * 150).toLocaleString()} ETB</p>
              
              <div className="mt-2 h-6">
                {(selectedProduct.stock ?? 10) <= 0 ? (
                  <span className="text-red-500 font-bold text-xs uppercase tracking-widest">Out of Stock</span>
                ) : (selectedProduct.stock ?? 10) <= 5 ? (
                  <span className="text-orange-500 font-medium text-xs">Only {selectedProduct.stock} units left!</span>
                ) : (
                  <span className="text-green-600 font-medium text-xs uppercase tracking-widest">In Stock</span>
                )}
              </div>
            </div>
        {/* ACTION ROW */}
<div className="modern-action-row">
  {/* Size Dropdown */}
  <div className="action-item relative">
    <button 
      className="action-btn-outline" 
      onClick={() => setOpenFilter(openFilter === 'Size' ? null : 'Size')}
    >
      <span className="text-gray-400 mr-2">SIZE:</span> 
      <span className="font-semibold">{selectedSize ?? 'Select'}</span>
      <ChevronDown 
        size={14} 
        className={`ml-auto transition-transform ${openFilter === 'Size' ? "rotate-180" : ""}`} 
      />
    </button>
    {openFilter === 'Size' && (
      <div className="filter-dropdown-menu">
        {filters.Size.map((opt) => (
          <button 
            key={opt} 
            onClick={() => { setSelectedSize(opt); setOpenFilter(null); }} 
            className={`opt-btn ${selectedSize === opt ? 'active' : ''}`}
          >
            {opt}
          </button>
        ))}
      </div>
    )}
  </div>

  {/* Color Dropdown */}
  <div className="action-item relative">
    <button 
      className="action-btn-outline" 
      onClick={() => setOpenFilter(openFilter === 'Color' ? null : 'Color')}
    >
      <span className="text-gray-400 mr-2">COLOR:</span> 
      <span className="font-semibold">{selectedColor ?? 'Select'}</span>
      <ChevronDown 
        size={14} 
        className={`ml-auto transition-transform ${openFilter === 'Color' ? "rotate-180" : ""}`} 
      />
    </button>
    {openFilter === 'Color' && (
      <div className="filter-dropdown-menu">
        {filters.Color.map((opt) => (
          <button 
            key={opt} 
            onClick={() => { setSelectedColor(opt); setOpenFilter(null); }} 
            className={`opt-btn ${selectedColor === opt ? 'active' : ''}`}
          >
            {opt}
          </button>
        ))}
      </div>
    )}
  </div>

  {/* Buy Now */}
  <button 
    className="action-btn-black disabled:opacity-50 disabled:cursor-not-allowed" 
    onClick={handleBuyNow}
    disabled={(selectedProduct.stock ?? 10) <= 0}
  >
    {(selectedProduct.stock ?? 10) <= 0 ? 'Sold Out' : 'Buy Now'}
  </button>

  {/* Add to Cart */}
  <button 
    className="action-btn-outline-black disabled:opacity-50 disabled:cursor-not-allowed" 
    onClick={handleAddToCart}
    disabled={(selectedProduct.stock ?? 10) <= 0}
  >
    {(selectedProduct.stock ?? 10) <= 0 ? 'Unavailable' : 'Add to Cart'}
  </button>
</div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default Index;