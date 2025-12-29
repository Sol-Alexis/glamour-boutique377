import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { ProductCard } from '@/components/ProductCard';
import { getProducts, Product } from '@/data/products';

interface ProductsProps {
  department?: 'men' | 'women' | 'kids' | 'all';
}

/**
 * Normalize URL category slug to match Product.subcategory
 * Example:
 *  - "caps-hats" → "Caps_Hats"
 *  - "jeans" → "Jeans"
 *  - undefined → "all"
 */
const normalizeCategory = (slug?: string): string => {
  if (!slug) return 'all';

  return slug
    .replace(/-/g, '_')
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('_');
};

const Products = ({ department = 'all' }: ProductsProps) => {
  const { category } = useParams<{ category?: string }>();

  const normalizedCategory = normalizeCategory(category);

  const products: Product[] = getProducts(department, normalizedCategory);

  return (
    <Layout>
      <div className="container mx-auto py-12 md:py-16">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl mb-4">
            {department === 'all'
              ? 'All'
              : department.charAt(0).toUpperCase() + department.slice(1)}{' '}
            {normalizedCategory === 'all'
              ? 'Products'
              : normalizedCategory.replace('_', ' & ')}
          </h1>

          <p className="font-body text-muted-foreground">
            {products.length} {products.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No products found.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Products;
