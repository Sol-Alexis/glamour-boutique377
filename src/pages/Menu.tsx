import React from 'react';
import './Menu.css';
import { X, Settings, ClipboardList, LogOut, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const Menu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { orders } = useCart();

  /* ---------------- THE FIX: FILTERED ORDER COUNT ---------------- */
  // This ensures User A doesn't see User B's order count.
  // We only count orders where the customerEmail matches the logged-in user's email.
  const orderCount = user 
    ? orders.filter((order: any) => order.customerEmail === user.email).length 
    : 0;

  const getInitials = (name: string) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleSignOut = () => {
    logout();
    onClose();
    navigate('/');
  };

  return (
    <>
      {/* Sidebar Overlay */}
      <div 
        className={`menu-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose} 
      />

      {/* Sidebar Panel */}
      <div className={`menu-panel ${isOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <h2>Menu</h2>
          <X className="close-icon" onClick={onClose} />
        </div>

        <div className="menu-content">
          {user ? (
            <>
              {/* Logged In: Profile Section */}
              <div className="menu-profile">
                <div className="profile-avatar initials-mode">
                   {getInitials(user.name)}
                </div>
                <div>
                  <p className="profile-name">{user.name}</p>
                  <p className="profile-email">{user.email}</p>
                </div>
              </div>

              {/* Logged In: Navigation Links */}
              <div className="menu-section">
                <p className="section-label">Account</p>
                
                <button 
                  className="menu-item relative flex items-center justify-between w-full" 
                  onClick={() => handleNavigate('/orders')}
                >
                  <div className="flex items-center">
                    <ClipboardList size={20} className="menu-icon" />
                    <span>My Orders</span>
                  </div>
                  
                  {/* Filtered Badge */}
                  {orderCount > 0 && (
                    <span className="order-badge bg-black text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {orderCount}
                    </span>
                  )}
                </button>

                <button className="menu-item" onClick={() => handleNavigate('/settings')}>
                  <Settings size={20} className="menu-icon" />
                  <span>Settings</span>
                </button>
              </div>

              {/* Logged In: Logout Button */}
              <div className="menu-footer">
                <button className="menu-item signout text-red-500" onClick={handleSignOut}>
                  <LogOut size={20} className="menu-icon" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            /* Logged Out: Auth Button */
            <div className="menu-section">
               <p className="section-label">Welcome</p>
               <button className="menu-item" onClick={() => handleNavigate('/auth')}>
                 <LogIn size={20} className="menu-icon" />
                 <span>Login / Register</span>
               </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Menu;