import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { getProductById } from '@/data/products';

const ProductDetails = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('product') || '';
  const product = getProductById(productId);

  const [selectedColor, setSelectedColor] = useState<string>('default');
  const [selectedSize, setSelectedSize] = useState<string>('M');

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto py-16 text-center">
          <p>Product not found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="flex justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="max-w-sm rounded-lg shadow-lg"
          />
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-xl text-gray-700 mb-6">ETB {product.price}</p>

          {/* Color choices (example) */}
          <div className="mb-6">
            <p className="font-medium mb-2">Color:</p>
            {['default', 'black', 'brown', 'blue'].map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 border rounded mr-2 ${
                  selectedColor === color ? 'bg-black text-white' : ''
                }`}
              >
                {color}
              </button>
            ))}
          </div>

          {/* Size choices */}
          <div className="mb-6">
            <p className="font-medium mb-2">Size:</p>
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border rounded mr-2 ${
                  selectedSize === size ? 'bg-black text-white' : ''
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800">
            Add to Cart
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;