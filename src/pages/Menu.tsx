import React from "react";
import "./Menu.css";
import {
  X,
  Settings,
  ClipboardList,
  LogOut,
  LogIn,
  LayoutDashboard,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { isUserAdmin } from "@/config/admins";

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const Menu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { orders } = useCart();

  /* ---------------- ADMIN CHECK ---------------- */
  const isAdmin = user ? isUserAdmin(user.email) : false;

  /* ---------------- USER ORDER COUNT ---------------- */
  const orderCount = user
    ? orders.filter((order: any) => order.customerEmail === user.email).length
    : 0;

  /* ---------------- FAQ STATE ---------------- */
  const [openFAQ, setOpenFAQ] = React.useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  /* ---------------- FAQ DATA ---------------- */
  const faqItems = [
    {
      question: "How long does shipping take?",
      answer:
        "Shipping usually takes 3–7 business days depending on your location. A tracking number will be sent once your order is shipped.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Yes, we provide international shipping to selected countries. Delivery times and costs depend on your location.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "We accept secure online payments including cards and mobile money options available at checkout.",
    },
    {
      question: "Can I return or exchange an item?",
      answer:
        "Items can be returned or exchanged within 7 days of delivery, provided they are unused and in original condition.",
    },
    {
      question: "Is shopping on Glamour Boutique safe?",
      answer:
        "Yes. We use secure authentication and encrypted transactions to protect your personal and payment information.",
    },
  ];

  /* ---------------- HELPERS ---------------- */
  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
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
    navigate("/");
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`menu-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`menu-panel ${isOpen ? "open" : ""}`}>
        <div className="menu-header">
          <h2>Menu</h2>
          <X className="close-icon" onClick={onClose} />
        </div>

        <div className="menu-content">
          {user ? (
            <>
              {/* PROFILE */}
              <div className="menu-profile">
                <div className="profile-avatar initials-mode">
                  {getInitials(user.name)}
                </div>
                <div>
                  <p className="profile-name">{user.name}</p>
                  <p className="profile-email">{user.email}</p>
                </div>
              </div>

              {/* ADMIN */}
              {isAdmin && (
                <div className="menu-section admin-section-mobile">
                  <p className="section-label text-amber-600">Management</p>
                  <button
                    className="menu-item admin-highlight"
                    onClick={() => handleNavigate("/admin/orders")}
                  >
                    <LayoutDashboard size={20} className="menu-icon" />
                    <span className="font-bold">Admin Dashboard</span>
                  </button>
                </div>
              )}

              {/* ACCOUNT */}
              <div className="menu-section">
                <p className="section-label">Account</p>

                <button
                  className="menu-item flex justify-between items-center w-full"
                  onClick={() => handleNavigate("/orders")}
                >
                  <div className="flex items-center">
                    <ClipboardList size={20} className="menu-icon" />
                    <span>My Orders</span>
                  </div>

                  {orderCount > 0 && (
                    <span className="order-badge bg-black text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {orderCount}
                    </span>
                  )}
                </button>

                <button
                  className="menu-item"
                  onClick={() => handleNavigate("/settings")}
                >
                  <Settings size={20} className="menu-icon" />
                  <span>Settings</span>
                </button>
              </div>

              {/* FAQ */}
              <div className="menu-section">
                <p className="section-label underline font-semibold">FAQ</p>

                {faqItems.map((item, index) => (
                  <div key={index} className="faq-item">
                    <button
                      className="menu-item flex justify-between items-center w-full"
                      onClick={() => toggleFAQ(index)}
                    >
                      <span>{item.question}</span>
                      {openFAQ === index ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>

                    {openFAQ === index && (
                      <p className="faq-answer text-sm text-gray-600 px-2 pb-2">
                        {item.answer}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* LOGOUT */}
              <div className="menu-footer">
                <button
                  className="menu-item signout text-red-500"
                  onClick={handleSignOut}
                >
                  <LogOut size={20} className="menu-icon" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            /* LOGGED OUT */
            <div className="menu-section">
              <p className="section-label">Welcome</p>
              <button
                className="menu-item"
                onClick={() => handleNavigate("/auth")}
              >
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
