import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Product } from "@/data/products";
import { useAuth } from "@/context/AuthContext";

const getCartKey = (email?: string) =>
  email ? `glamour_cart_${email}` : "glamour_cart_guest";

const getOrdersKey = (email?: string) =>
  email ? `glamour_orders_${email}` : "glamour_orders_guest";

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
  addedAt: string; // store as ISO string
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: string;
  date: string;
  paymentMethod: string;
  customerEmail?: string;
  customerName: string;
  customerPhone?: string; // ← add this
  customerAddress?: string;
}

interface CartContextType {
  items: CartItem[];
  orders: Order[];
  addToCart: (
    product: Product,
    size: string,
    color: string,
    quantity?: number,
  ) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (
    productId: string,
    size: string,
    color: string,
    quantity: number,
  ) => void;
  clearCart: () => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, newStatus: string) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_EXPIRY_DAYS = 7;
const CART_EXPIRY_MS = CART_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]); // Only define this ONCE
  const [isInitialized, setIsInitialized] = useState(false);
  const { user } = useAuth();

  /* ------------------ LOAD DATA (ONCE) ------------------ */
  useEffect(() => {
    const cartKey = getCartKey(user?.email);
    const ordersKey = getOrdersKey(user?.email);

    const savedCart = localStorage.getItem(cartKey);
    const savedOrders = localStorage.getItem(ordersKey);

    setItems(savedCart ? JSON.parse(savedCart) : []);
    setOrders(savedOrders ? JSON.parse(savedOrders) : []);

    setIsInitialized(true);
  }, [user]);

  /* ------------------ SAVE CART ------------------ */
  useEffect(() => {
    if (!isInitialized) return;

    const cartKey = getCartKey(user?.email);
    localStorage.setItem(cartKey, JSON.stringify(items));
  }, [items, isInitialized, user]);

  /* ------------------ SAVE ORDERS ------------------ */
  useEffect(() => {
    if (!isInitialized) return;

    // Save the current user's orders
    const ordersKey = getOrdersKey(user?.email);
    localStorage.setItem(ordersKey, JSON.stringify(orders));

    // ALSO save to global orders for admin
    const allOrdersKey = "glamour_orders_all";
    const savedAllOrders = localStorage.getItem(allOrdersKey);
    const allOrders = savedAllOrders ? JSON.parse(savedAllOrders) : [];

    // Merge current orders with global orders, avoiding duplicates
    const updatedAllOrders = [
      ...orders,
      ...allOrders.filter(
        (o: Order) => !orders.some((u: Order) => u.id === o.id),
      ),
    ];

    localStorage.setItem(allOrdersKey, JSON.stringify(updatedAllOrders));
  }, [orders, isInitialized, user]);

  /* ------------------ AUTO-EXPIRE CART ITEMS ------------------ */
  useEffect(() => {
    const now = Date.now();
    let inventory = JSON.parse(
      localStorage.getItem("glamour_inventory") || "[]",
    );

    const validItems = items.filter((item) => {
      const addedTime = new Date(item.addedAt).getTime();
      const expired = now - addedTime > CART_EXPIRY_MS;

      if (expired) {
        const index = inventory.findIndex(
          (p: any) => String(p.id) === String(item.product.id),
        );
        if (index !== -1) {
          inventory[index].stock += item.quantity;
        }
      }

      return !expired;
    });

    if (validItems.length !== items.length) {
      localStorage.setItem("glamour_inventory", JSON.stringify(inventory));
      setItems(validItems);
    }
  }, [items]);

  /* ------------------ STOCK HELPER ------------------ */
  const getLiveStockLimit = (productId: string, fallbackStock: number) => {
    const savedInventory = localStorage.getItem("glamour_inventory");
    if (savedInventory) {
      const inventory = JSON.parse(savedInventory);
      const liveProduct = inventory.find(
        (p: any) => String(p.id) === String(productId),
      );
      if (liveProduct) return Number(liveProduct.stock);
    }
    return fallbackStock;
  };

  /* ------------------ ADD TO CART ------------------ */
  const addToCart = (
    product: Product,
    size: string,
    color: string,
    quantity = 1,
  ) => {
    const stockLimit = getLiveStockLimit(product.id, product.stock ?? 0);
    if (stockLimit <= 0) return;

    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.product.id === product.id && i.size === size && i.color === color,
      );

      if (existing) {
        return prev.map((item) =>
          item === existing
            ? {
                ...item,
                quantity: Math.min(item.quantity + quantity, stockLimit),
              }
            : item,
        );
      }

      return [
        ...prev,
        {
          product,
          size,
          color,
          quantity: Math.min(quantity, stockLimit),
          addedAt: new Date().toISOString(),
        },
      ];
    });
  };

  /* ------------------ REMOVE ------------------ */
  const removeFromCart = (productId: string, size: string, color: string) => {
    setItems((prev) =>
      prev.filter(
        (i) =>
          !(i.product.id === productId && i.size === size && i.color === color),
      ),
    );
  };

  /* ------------------ UPDATE QTY ------------------ */
  const updateQuantity = (
    productId: string,
    size: string,
    color: string,
    quantity: number,
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId &&
        item.size === size &&
        item.color === color
          ? {
              ...item,
              quantity: Math.min(
                quantity,
                getLiveStockLimit(productId, item.product.stock ?? 0),
              ),
            }
          : item,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(getCartKey(user?.email));
  };

  /* ------------------ ADD ORDER ------------------ */
  const addOrder = (order: Order) => {
    // Add to the current user's orders
    setOrders((prev) => [order, ...prev]);

    // Save to the current user's orders in localStorage
    if (user) {
      const userOrdersKey = getOrdersKey(user.email);
      const savedUserOrders = localStorage.getItem(userOrdersKey);
      const userOrders = savedUserOrders ? JSON.parse(savedUserOrders) : [];
      localStorage.setItem(
        userOrdersKey,
        JSON.stringify([order, ...userOrders]),
      );
    }

    // Save to global orders for admin
    const allOrdersKey = "glamour_orders_all";
    const savedAllOrders = localStorage.getItem(allOrdersKey);
    const allOrders = savedAllOrders ? JSON.parse(savedAllOrders) : [];
    localStorage.setItem(allOrdersKey, JSON.stringify([order, ...allOrders]));
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    );
  };

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce(
    (s, i) => s + i.product.price * i.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        orders,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addOrder,
        updateOrderStatus,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
