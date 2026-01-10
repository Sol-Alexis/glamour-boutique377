import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toEthiopianDate } from "@/lib/ethiopianCalendar";
import "./Cart.css";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  // State for the "Remove?" confirmation toggle
  const [confirmingRemove, setConfirmingRemove] = useState<string | null>(null);

  // State for the "Item Removed" local feedback message
  const [removedItems, setRemovedItems] = useState<string[]>([]);

  const handleRemove = (productId: string, size: string, color: string) => {
    const itemKey = `${productId}-${size}-${color}`;

    // 1. Show the "Item Removed" text locally
    setRemovedItems((prev) => [...prev, itemKey]);
    setConfirmingRemove(null);

    // 2. Wait for user to see the message, then delete from data
    setTimeout(() => {
      removeFromCart(productId, size, color);
      setRemovedItems((prev) => prev.filter((id) => id !== itemKey));
    }, 800);
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="cart-empty">
          <ShoppingBag className="cart-empty-icon" />
          <h1 className="cart-empty-title">Your cart is empty</h1>
          <p className="cart-empty-text">
            Looks like you haven't added anything yet.
          </p>
          <Link to="/shop">
            <Button variant="default" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="cart-container bg-background text-foreground transition-colors duration-500">
        <h1 className="cart-heading border-b border-border pb-4">
          Shopping Cart
        </h1>

        <div className="cart-grid">
          <div className="cart-items">
            {items.map((item) => {
              const itemKey = `${item.product.id}-${item.size}-${item.color}`;
              const isConfirming = confirmingRemove === itemKey;
              const isActuallyRemoved = removedItems.includes(itemKey);

              // --- THE FIX: LOOK UP LIVE STOCK FOR THIS SPECIFIC ITEM ---
              const localData = localStorage.getItem("glamour_inventory");
              const localProducts = localData ? JSON.parse(localData) : [];
              const liveProduct = localProducts.find(
                (p: any) => String(p.id) === String(item.product.id)
              );

              // Use live stock from Admin, fallback to initial product stock, default to 0
              const stockLimit = liveProduct
                ? Number(liveProduct.stock)
                : item.product.stock ?? 0;

              const isAtMaxStock = item.quantity >= stockLimit;
              const isSoldOut = stockLimit <= 0;
              // ---------------------------------------------------------

              return (
                <div
                  key={itemKey}
                  className={`cart-item relative overflow-hidden min-h-[120px] ${
                    isSoldOut ? "opacity-60 grayscale-[0.5]" : ""
                  }`}
                >
                  {/* ⭐ LOCAL REMOVAL FEEDBACK OVERLAY */}
                  {isActuallyRemoved && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/90 backdrop-blur-sm animate-in fade-in zoom-in duration-300">
                      <p className="text-destructive font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                        <X className="h-4 w-4" /> Item Removed
                      </p>
                    </div>
                  )}

                  <Link
                    to={`/product/${item.product.id}`}
                    className="cart-item-image"
                  >
                    <img src={item.product.image} alt={item.product.name} />
                  </Link>

                  <div className="cart-item-details">
                    <div className="cart-item-header">
                      <Link
                        to={`/product/${item.product.id}`}
                        className="cart-item-name"
                      >
                        {item.product.name}
                      </Link>

                      <div className="flex items-center">
                        {isConfirming ? (
                          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-2">
                            <span className="text-[11px] font-bold text-red-500 uppercase tracking-tighter">
                              Remove?
                            </span>
                            <button
                              onClick={() =>
                                handleRemove(
                                  item.product.id,
                                  item.size,
                                  item.color
                                )
                              }
                              className="text-[11px] font-black hover:underline"
                            >
                              YES
                            </button>
                            <button
                              onClick={() => setConfirmingRemove(null)}
                              className="text-[11px] font-bold text-gray-400 hover:text-black"
                            >
                              NO
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmingRemove(itemKey)}
                            className="cart-remove hover:text-red-500 transition-colors"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="cart-item-info">
                      <span className="cart-item-variant">
                        Size:{" "}
                        <span className="font-semibold text-foreground">
                          {item.size}
                        </span>{" "}
                        | Color:{" "}
                        <span className="font-semibold text-foreground">
                          {item.color}
                        </span>
                      </span>
                      {isSoldOut && (
                        <span className="text-[10px] font-bold text-red-500 block mt-1 uppercase">
                          Recently Sold Out
                        </span>
                      )}
                    </div>

                    <div className="cart-item-footer">
                      <div className="flex flex-col items-start gap-1">
                        <div className="cart-quantity">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.size,
                                item.color,
                                item.quantity - 1
                              )
                            }
                            disabled={isSoldOut}
                          >
                            <Minus className="h-3 w-3" />
                          </button>

                          <span>{isSoldOut ? 0 : item.quantity}</span>

                          <button
                            onClick={() => {
                              if (!isAtMaxStock && !isSoldOut) {
                                updateQuantity(
                                  item.product.id,
                                  item.size,
                                  item.color,
                                  item.quantity + 1
                                );
                              }
                            }}
                            className={
                              isAtMaxStock || isSoldOut
                                ? "opacity-30 cursor-not-allowed"
                                : ""
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* ⭐ DYNAMIC STOCK ALERT */}
                        {isSoldOut ? (
                          <p className="text-[9px] font-bold text-red-600 animate-pulse">
                            UNAVAILABLE
                          </p>
                        ) : (
                          isAtMaxStock && (
                            <p className="text-[9px] font-bold text-red-500 animate-in fade-in slide-in-from-top-1">
                              LIMIT: {stockLimit} UNITS
                            </p>
                          )
                        )}
                      </div>

                      <p className="cart-price">
                        {(item.product.price * item.quantity).toLocaleString()}{" "}
                        ETB
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* 2. Updated Summary to use bg-card and border-border */}
          <div className="cart-summary bg-card border border-border shadow-md transition-colors duration-500">
            <h2 className="text-foreground">Order Summary</h2>
            <div className="cart-summary-details">
              <div className="cart-summary-row text-muted-foreground">
                <span>Subtotal: </span>
                <span className="text-foreground">
                  {totalPrice.toLocaleString()} ETB
                </span>
              </div>
              <div className="cart-summary-row text-muted-foreground">
                <span>Shipping: </span>
                <span
                  className={
                    totalPrice >= 15000
                      ? "text-green-500 font-bold"
                      : "text-foreground"
                  }
                >
                  {totalPrice >= 15000 ? "Free" : "200 ETB"}
                </span>
              </div>
            </div>

            {/* 3. Updated Total with theme border */}
            <div className="cart-summary-total border-t border-border pt-4 text-foreground">
              <span>Total: </span>
              <span className="text-primary font-bold">
                {(totalPrice >= 15000
                  ? totalPrice
                  : totalPrice + 200
                ).toLocaleString()}{" "}
                ETB
              </span>
            </div>

            {/* 4. Updated Button to use theme colors */}
            <Button
              onClick={() => navigate("/checkout")}
              variant="default"
              size="lg"
              className="cart-checkout-btn w-full mt-4 bg-primary text-primary-foreground hover:opacity-90 transition-all"
            >
              Checkout
            </Button>

            <p className="cart-summary-note text-muted-foreground italic mt-4 text-center">
              Free shipping on orders over 15,000 ETB
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
