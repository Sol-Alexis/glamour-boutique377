import './Header.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  User,
  Menu as MenuIcon,
  Search,
  LayoutDashboard, // Added this icon
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { products, Product } from '@/data/products';
import Menu from '@/pages/Menu'; 
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user

  /* ---------------- STATE ---------------- */
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  // The secret check for your email
  const isAdmin = user?.email?.toLowerCase() === "glamourboutique377@gmail.com";

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  /* ---------------- ACTIVE DEPARTMENT ---------------- */
  const getActiveDepartment = () => {
    if (location.pathname.startsWith('/men')) return 'men';
    if (location.pathname.startsWith('/women')) return 'women';
    if (location.pathname.startsWith('/kids')) return 'kids';
    return '';
  };

  const activeDept = getActiveDepartment();

  /* ---------------- LOGO CLICK ---------------- */
  const handleGlamourClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.dispatchEvent(new Event('glamourReset'));
    } else {
      navigate('/', { replace: true });
    }
  };

  /* ---------------- SEARCH FILTER ---------------- */
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(query))
    );

    setSearchResults(results);
  }, [searchQuery]);

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

  /* ---------------- RENDER ---------------- */
  return (
    <>
      <header className="header">
        <div className="header-container">
          {/* Logo */}
          <Link to="/" className="header-logo" onClick={handleGlamourClick}>
            GLAMOUR
          </Link>

          {/* Nav */}
          <nav className="header-nav">
            <Link
              to="/men"
              className={activeDept === 'men' ? 'active-department' : ''}
            >
              Men
            </Link>
            <Link
              to="/women"
              className={activeDept === 'women' ? 'active-department' : ''}
            >
              Women
            </Link>
            <Link
              to="/kids"
              className={activeDept === 'kids' ? 'active-department' : ''}
            >
              Kids
            </Link>

            {/* --- ADDED THE SECRET BUTTON HERE --- */}
            {isAdmin && (
              <Link 
                to="/admin/orders" 
                className="admin-nav-item" // We will add CSS for this below
              >
                <LayoutDashboard size={16} />
                ADMIN
              </Link>
            )}
          </nav>

          {/* Search */}
          <div className="header-search relative">
            <input
              type="text"
              placeholder="Search collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' && handleSearchClick()
              }
            />
            <button className="search-icon" onClick={handleSearchClick}>
              <Search size={20} />
            </button>

{/* Dropdown Results */}
{searchQuery && (
  <div className="search-results-dropdown">
    {searchResults.length > 0 ? (
      searchResults.map((p) => (
        <div
          key={p.id}
          className="search-result-item"
          onClick={() => handleSelectProduct(p.id)}
        >
          {/* Use 'search-result-image' to match the CSS fix */}
          <img 
            src={p.image} 
            alt={p.name} 
            className="search-result-image" 
            style={{ pointerEvents: 'none' }} 
          />
          <div className="search-text" style={{ pointerEvents: 'none' }}>
            <span className="product-name">{p.name}</span>
            <span className="product-dept">
              {p.department} – {(p.price * 150).toFixed(0)} ETB
            </span>
          </div>
        </div>
      ))
    ) : (
      <div className="search-result-item no-result">
        No products found.
      </div>
    )}
  </div>
)}
          </div>

          {/* Icons */}
          <div className="header-icons">
            {user ? (
              <div className="header-avatar-circle" onClick={() => setMenuOpen(true)}>
                {getInitials(user.name)}
              </div>
            ) : (
              <Link to="/auth">
                <User />
              </Link>
            )}
            
            <Link to="/cart" className="relative">
              <ShoppingBag />
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </Link>

            <button
              className="menu-button"
              onClick={() => setMenuOpen(true)}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      <Menu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        user={user}
        onSignOut={() => {
          setMenuOpen(false);
        }}
      />
    </>
  );
};

export default Header;