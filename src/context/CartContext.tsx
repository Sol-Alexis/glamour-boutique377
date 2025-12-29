import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product } from '@/data/products';

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
  addedAt: Date;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: string;
  date: Date;
  paymentMethod: string;
}

interface CartContextType {
  items: CartItem[];
  orders: Order[];
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, newStatus: string) => void; 
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  
  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem('glamour_orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  useEffect(() => {
    localStorage.setItem('glamour_orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (product: Product, size: string, color: string, quantity = 1) => {
    setItems(prev => {
      const existingItem = prev.find(
        item => item.product.id === product.id && item.size === size && item.color === color
      );

      const stockLimit = product.stock ?? 10;

      if (existingItem) {
        return prev.map(item => {
          if (item.product.id === product.id && item.size === size && item.color === color) {
            const newQuantity = item.quantity + quantity;
            return { 
              ...item, 
              quantity: newQuantity > stockLimit ? stockLimit : newQuantity 
            };
          }
          return item;
        });
      }

      const initialQuantity = quantity > stockLimit ? stockLimit : quantity;
      return [...prev, { product, size, color, quantity: initialQuantity, addedAt: new Date() }];
    });
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setItems(prev =>
      prev.filter(item => !(item.product.id === productId && item.size === size && item.color === color))
    );
  };

  const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    setItems(prev =>
      prev.map(item => {
        if (item.product.id === productId && item.size === size && item.color === color) {
          const stockLimit = item.product.stock ?? 10;
          const finalQuantity = quantity > stockLimit ? stockLimit : quantity;
          return { ...item, quantity: finalQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => setItems([]);

  // --- UPDATED ADD ORDER FUNCTION ---
  const addOrder = (order: Order) => {
    // 1. Add order to state/history
    setOrders(prev => [order, ...prev]);

    // 2. Reduce Stock in Inventory
    const savedInventory = localStorage.getItem('glamour_inventory');
    if (savedInventory) {
      let inventory = JSON.parse(savedInventory);

      order.items.forEach((orderItem) => {
        // Find the index of the product in the master inventory list
        const productIndex = inventory.findIndex(
          (p: any) => String(p.id) === String(orderItem.product.id)
        );

        if (productIndex !== -1) {
          const currentStock = Number(inventory[productIndex].stock) || 0;
          const boughtQty = Number(orderItem.quantity);
          
          // Deduct the quantity bought
          inventory[productIndex].stock = Math.max(0, currentStock - boughtQty);
        }
      });

      // Update the central inventory storage
      localStorage.setItem('glamour_inventory', JSON.stringify(inventory));
      
      // Notify other parts of the app (like AdminOrders) that inventory changed
      window.dispatchEvent(new Event('storage'));
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
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
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};