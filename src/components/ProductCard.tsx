import { useState } from 'react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('original');
  const [selectedColor, setSelectedColor] = useState<string>('standard');

  const handleBuyNow = () => {
    alert(`Preview: ${product.name}\nSize: ${selectedSize}\nColor: ${selectedColor}`);
  };
  const handleAddToCart = () => {
    addToCart({
      ...product,
      selectedSize,
      selectedColor,
    });
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="group block animate-fade-in">
      <div className="aspect-[3/4] overflow-hidden bg-muted mb-4 cursor-pointer">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-1">
        <h3 className="font-body text-sm tracking-wide group-hover:text-muted-foreground transition-colors">
          {product.name}
        </h3>
        <p className="font-body text-sm text-muted-foreground">
          ${product.price}
        </p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleBuyNow}
            className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 text-xs"
          >
            Buy Now
          </button>
          <button
            onClick={handleAddToCart}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};