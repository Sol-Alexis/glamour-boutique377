import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { products as staticProducts } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowLeft, ChevronRight } from 'lucide-react';

const ProductDetails = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  
  // Get the ID from URL: ?product=123
  const productId = searchParams.get('product') || '';

  /* ---------------- 1. MERGE INVENTORY ---------------- */
  // This combines your code files with your Admin dashboard additions
  const allProducts = useMemo(() => {
    const saved = localStorage.getItem('glamour_inventory');
    const localProducts = saved ? JSON.parse(saved) : [];
    
    const merged = new Map();
    // Load static products
    staticProducts.forEach(p => merged.set(String(p.id), p));
    // Overwrite with local products
    localProducts.forEach((p: any) => merged.set(String(p.id), p));
    
    return Array.from(merged.values());
  }, []);

  /* ---------------- 2. DEFINE THE PRODUCT ---------------- */
  // We use "currentProduct" to be very clear and avoid naming conflicts
  const currentProduct = useMemo(() => {
    return allProducts.find(p => String(p.id) === String(productId));
  }, [allProducts, productId]);

  const [selectedColor, setSelectedColor] = useState<string>('standard');
  const [selectedSize, setSelectedSize] = useState<string>('original');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  // If ID is wrong or product doesn't exist
  if (!currentProduct) {
    return (
      <Layout>
        <div className="container mx-auto py-32 text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="mr-2" size={18} /> Back to Shop
          </Button>
        </div>
      </Layout>
    );
  }
const handleAddToCart = () => {
    if (!currentProduct) return;
    
    // Correct function: addToCart | Correct args: 4 separate values
    addToCart(currentProduct, selectedSize || "standard", selectedColor || "original", 1);
    
    toast({
      title: "Added to Bag",
      description: `${currentProduct.name} has been added.`
    });
  };

  const handleBuyNow = () => {
    if (!currentProduct) return;

    if (currentProduct.stock !== undefined && currentProduct.stock <= 0) {
      toast({
        variant: "destructive",
        title: "Out of Stock",
        description: "This item is currently unavailable."
      });
      return;
    }

    // Correct function: addToCart | Correct args: 4 separate values
    addToCart(currentProduct, selectedSize || "M", selectedColor || "Default", 1);

    navigate('/checkout');
    window.scrollTo(0, 0);
  };
  return (
    <Layout>
      <div className="container mx-auto py-12 md:py-24 px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-8 uppercase tracking-widest">
          <span className="cursor-pointer hover:text-black" onClick={() => navigate('/')}>Home</span>
          <ChevronRight size={12} />
          <span className="text-black">{currentProduct.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left: Image */}
          <div className="bg-[#fdfdfd] border border-gray-100 rounded-3xl p-8 flex items-center justify-center">
            <img
              src={currentProduct.image}
              alt={currentProduct.name}
              className="w-full max-w-md object-contain mix-blend-multiply"
            />
          </div>

          {/* Right: Content */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter leading-none">
              {currentProduct.name}
            </h1>
            
            <p className="text-3xl font-medium mb-8 text-zinc-900">
  {currentProduct.price.toLocaleString()} <span className="text-sm font-bold">ETB</span>
</p>

            <div className="space-y-8">
              {/* Color Selection */}
              <div>
                <p className="text-[10px] font-black uppercase mb-3 tracking-[0.2em] text-gray-400">Select Color</p>
                <div className="flex gap-2">
                  {['default', 'black', 'brown'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-2 text-[11px] font-bold uppercase border-2 transition-all ${
                        selectedColor === color 
                          ? 'border-black bg-black text-white' 
                          : 'border-gray-100 hover:border-gray-200 text-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <p className="text-[10px] font-black uppercase mb-3 tracking-[0.2em] text-gray-400">Select Size</p>
                <div className="flex gap-2">
                  {(currentProduct.sizes || ['S', 'M', 'L', 'XL']).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 flex items-center justify-center text-xs font-bold border-2 transition-all ${
                        selectedSize === size 
                          ? 'border-black bg-black text-white' 
                          : 'border-gray-100 hover:border-gray-200 text-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4">
                <button 
                  onClick={handleBuyNow}
                  className="w-full py-5 bg-black text-white font-black uppercase tracking-widest text-xs hover:bg-zinc-800 transition-all active:scale-[0.98]"
                >
                  Buy It Now
                </button>
                <button 
                  onClick={handleAddToCart}
                  className="w-full py-5 border-2 border-black text-black font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={18} /> Add to Bag
                </button>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100">
              <p className="text-[11px] text-gray-400 uppercase tracking-widest leading-relaxed">
                Free Express Delivery in Mekelle <br />
                Secure Checkout Powered by Glamour
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;