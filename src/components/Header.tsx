import './Header.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  User,
  Menu as MenuIcon,
  Search,
  LayoutDashboard,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState, useEffect, useMemo } from 'react';
import { products as staticProducts, Product } from '@/data/products';
import Menu from '@/pages/Menu'; 
import { useAuth } from '@/context/AuthContext';
import { isUserAdmin } from '@/config/admins';
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  isAdmin?: boolean;
}

const Header = ({ isAdmin: isAdminProp }: HeaderProps) => {
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  /* ---------------- STATE ---------------- */
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  // Derived Admin Status
  const isAdmin = isAdminProp || (user ? isUserAdmin(user.email) : false);

  /* ---------------- THE SEARCH FIX: MERGE PRODUCTS ---------------- */
  const allProducts = useMemo(() => {
    const saved = localStorage.getItem('glamour_inventory');
    if (saved) {
      const localProducts = JSON.parse(saved);
      // We use a Map to merge them by ID so we don't get duplicates
      const merged = new Map();
      staticProducts.forEach(p => merged.set(String(p.id), p));
      localProducts.forEach((p: any) => merged.set(String(p.id), p));
      return Array.from(merged.values());
    }
    return staticProducts;
  }, []);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  /* ---------------- ACTIVE DEPARTMENT ---------------- */
  const getActiveDepartment = () => {
    if (location.pathname.startsWith('/men')) return 'men';
    if (location.pathname.startsWith('/women')) return 'women';
    if (location.pathname.startsWith('/kids')) return 'kids';
    if (location.pathname.startsWith('/admin')) return 'admin';
    return '';
  };

  const activeDept = getActiveDepartment();

/* ---------------- LOGO CLICK ---------------- */
  const handleGlamourClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Always dispatch the reset event so both Index and Header can hear it
    window.dispatchEvent(new Event('glamourReset'));

    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/', { replace: true });
    }
  };

  /* ---------------- LISTEN FOR RESET ---------------- */
  useEffect(() => {
    const handleResetSignal = () => {
      setSearchQuery(''); // This physically clears the "men hoodie" text
      setSearchResults([]); // This closes the dropdown
    };

    window.addEventListener('glamourReset', handleResetSignal);
    return () => window.removeEventListener('glamourReset', handleResetSignal);
  }, []);

  /* ---------------- UPDATED SEARCH FILTER ---------------- */
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    // Now searching through allProducts (Static + LocalStorage)
    const results = allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(query))
    );

    setSearchResults(results);
  }, [searchQuery, allProducts]);

  /* ---------------- SEARCH ACTIONS ---------------- */
  const handleSelectProduct = (id: string | number) => {
    navigate(`/?productId=${id}`);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSearchClick = () => {
    if (!searchQuery.trim()) return;
    navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <>
      <header className={`header ${activeDept === 'admin' ? 'admin-mode' : ''}`}>
        <div className="header-container">
          <Link to="/" className="header-logo" onClick={handleGlamourClick}>
            GLAMOUR
          </Link>

          <nav className="header-nav">
            <Link to="/men" className={activeDept === 'men' ? 'active-department' : ''}>Men</Link>
            <Link to="/women" className={activeDept === 'women' ? 'active-department' : ''}>Women</Link>
            <Link to="/kids" className={activeDept === 'kids' ? 'active-department' : ''}>Kids</Link>

            {isAdmin && (
              <Link 
                to="/admin/orders" 
                className={`admin-nav-item ${activeDept === 'admin' ? 'active-admin' : ''}`}
              >
                <LayoutDashboard size={16} />
                ADMIN
              </Link>
            )}
          </nav>

          <div className="header-search relative">
            <input
              type="text"
              placeholder="Search collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
            />
            <button className="search-icon" onClick={handleSearchClick}>
              <Search size={20} />
            </button>

            {searchQuery && (
              <div className="search-results-dropdown">
                {searchResults.length > 0 ? (
                  searchResults.map((p) => (
                    <div
                      key={p.id}
                      className="search-result-item"
                      onClick={() => handleSelectProduct(p.id)}
                    >
                      <img src={p.image} alt={p.name} className="search-result-image" />
                      <div className="search-text">
                        <span className="product-name">{p.name}</span>
                        <span className="product-dept">
                          {p.department} – {(p.price * 150).toFixed(0)} ETB
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="search-result-item no-result">No products found.</div>
                )}
              </div>
            )}
          </div>

          <div className="header-icons">
            <ThemeToggle />
            {user ? (
              <div className="header-avatar-circle" onClick={() => setMenuOpen(true)}>
                {getInitials(user.name)}
              </div>
            ) : (
              <Link to="/auth"><User /></Link>
            )}
            
            <Link to="/cart" className="relative">
              <ShoppingBag />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </Link>

            <button className="menu-button" onClick={() => setMenuOpen(true)}>
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      <Menu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
};

export default Header;