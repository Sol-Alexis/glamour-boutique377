import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ShopLanding from "./pages/ShopLanding";
import Settings from "./pages/Settings";
import Orders from "./pages/Orders";
import OrderSuccess from "./pages/OrderSuccess"; // Import Order Success
import AdminOrders from "./pages/AdminOrders"; // Import Admin Dashboard
import AdminProfile from "./pages/AdminProfile";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />

              {/* Department landing pages */}
              <Route path="/men" element={<Index department="men" />} />
              <Route path="/women" element={<Index department="women" />} />
              <Route path="/kids" element={<Index department="kids" />} />

              {/* Category-specific pages WITH department */}
              <Route
                path="/men/:category"
                element={<Products department="men" />}
              />
              <Route
                path="/women/:category"
                element={<Products department="women" />}
              />
              <Route
                path="/kids/:category"
                element={<Products department="kids" />}
              />

              {/* Category-specific pages WITHOUT department → show all */}
              <Route path="/categories" element={<Index />} />

              <Route path="/products" element={<Products department="all" />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/shop" element={<ShopLanding />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/orders" element={<Orders />} />

              {/* Admin Routes - Keep these "secret" */}
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/profile" element={<AdminProfile />} />
              {/* Catch-all Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
