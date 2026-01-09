import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import "./Checkout.css";

import CBELogo from "../assets/cbe.jfif";
import TelebirrLogo from "../assets/telebirr.png";

const Checkout = () => {
  const { items, clearCart, addOrder } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const buyNowItem = (location.state as any)?.buyNowItem;
  const checkoutItems = buyNowItem ? [buyNowItem] : items;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    paymentMethod: "",
  });

  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [userEnteredAmount, setUserEnteredAmount] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const subtotalETB = checkoutItems.reduce((acc, item) => {
    const price = item.product?.price || item.price || 0;
    const quantity = item.quantity || 1;
    return acc + price * quantity;
  }, 0);

  const shippingCost = subtotalETB >= 15000 ? 0 : 200;
  const finalTotal = subtotalETB + shippingCost;

  const isInformationComplete =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.phone &&
    formData.address &&
    formData.city &&
    formData.state;

  const handleConfirmPayment = () => {
    if (!userEnteredAmount) {
      toast({
        title: "Amount Required",
        description: "Please enter the amount you transferred.",
        variant: "destructive",
      });
      return;
    }
    setPaymentConfirmed(true);
    setUserEnteredAmount("");
    toast({
      title: "Payment Registered",
      description: "Transfer confirmed. You can now place your order.",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentConfirmed) {
      toast({
        title: "Payment Required",
        description: "Please complete the transfer portal first.",
        variant: "destructive",
      });
      return;
    }

    const savedInventory = localStorage.getItem("glamour_inventory");
    if (savedInventory) {
      let inventory = JSON.parse(savedInventory);
      checkoutItems.forEach((cartItem) => {
        const productIndex = inventory.findIndex(
          (p: any) =>
            String(p.id) === String(cartItem.product?.id || cartItem.id)
        );
        if (productIndex !== -1) {
          const currentStock = Number(inventory[productIndex].stock) || 0;
          inventory[productIndex].stock = Math.max(
            0,
            currentStock - (cartItem.quantity || 1)
          );
        }
      });
      localStorage.setItem("glamour_inventory", JSON.stringify(inventory));
    }

    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
      customerEmail: formData.email,
      items: [...checkoutItems],
      total: finalTotal,
      status: "Processing",
      date: new Date().toISOString(),
      paymentMethod: formData.paymentMethod,
      customerName: `${formData.firstName} ${formData.lastName}`,
      phone: formData.phone,
      address: `${formData.address}, ${formData.city}`,
    };

    addOrder(newOrder);
    if (!buyNowItem) clearCart();
    navigate("/order-success", { state: { order: newOrder } });
  };

  return (
    <Layout>
      <div className="checkout-page-wrapper">
        <div className="checkout-container bg-black min-h-screen">
          <h1 className="checkout-heading">Checkout</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              <div className="lg:col-span-2 space-y-8">
                <section>
                  <h2 className="checkout-section-title">
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="checkout-field">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="checkout-input"
                      />
                    </div>
                    <div className="checkout-field">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="checkout-input"
                      />
                    </div>
                    <div className="checkout-field">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="checkout-input"
                      />
                    </div>
                    <div className="checkout-field">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="09... or 07..."
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="checkout-input"
                      />
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="checkout-section-title">Shipping Address</h2>
                  <div className="space-y-4">
                    <div className="checkout-field">
                      <Label htmlFor="address">
                        Street Address / House No.
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="checkout-input"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="checkout-field">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="checkout-input"
                        />
                      </div>
                      <div className="checkout-field">
                        <Label htmlFor="state">Region / Subcity</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="checkout-input"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="checkout-section-title">Payment Method</h2>
                  {!isInformationComplete && (
                    <p className="text-xs text-destructive font-bold mb-4 uppercase">
                      ! Please fill in all details to unlock payment
                    </p>
                  )}

                  <RadioGroup
                    disabled={!isInformationComplete}
                    value={formData.paymentMethod}
                    onValueChange={(val) => {
                      setFormData((p) => ({ ...p, paymentMethod: val }));
                      setPaymentConfirmed(false);
                    }}
                    className={`checkout-radio-group ${
                      !isInformationComplete ? "opacity-50" : ""
                    }`}
                  >
                    <div
                      className={`checkout-radio-option ${
                        formData.paymentMethod === "cbe"
                          ? "border-primary"
                          : "border-border"
                      }`}
                    >
                      <RadioGroupItem value="cbe" id="cbe" />
                      <Label
                        htmlFor="cbe"
                        className="flex items-center gap-3 cursor-pointer w-full"
                      >
                        <img
                          src={CBELogo}
                          alt="CBE"
                          className="w-8 h-8 rounded bg-white p-1"
                        />
                        <span className="font-bold uppercase text-xs">
                          CBE Bank Transfer
                        </span>
                      </Label>
                    </div>

                    <div
                      className={`checkout-radio-option ${
                        formData.paymentMethod === "telebirr"
                          ? "border-primary"
                          : "border-border"
                      }`}
                    >
                      <RadioGroupItem value="telebirr" id="telebirr" />
                      <Label
                        htmlFor="telebirr"
                        className="flex items-center gap-3 cursor-pointer w-full"
                      >
                        <img
                          src={TelebirrLogo}
                          alt="Telebirr"
                          className="w-8 h-8 rounded bg-white p-1"
                        />
                        <span className="font-bold uppercase text-xs">
                          Telebirr
                        </span>
                      </Label>
                    </div>
                  </RadioGroup>

                  {isInformationComplete &&
                    formData.paymentMethod &&
                    !paymentConfirmed && (
                      <div className="mt-6 p-6 border-2 border-primary bg-card text-foreground space-y-4 animate-in slide-in-from-top-2 duration-300">
                        <h3 className="font-black uppercase italic text-sm border-b border-border pb-2 text-primary">
                          Glamour Payment Portal
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="checkout-field">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                              Recipient
                            </Label>
                            <Input
                              readOnly
                              value={
                                formData.paymentMethod === "cbe"
                                  ? "1000123456789"
                                  : "0914454545"
                              }
                              className="bg-muted font-mono font-bold border-none text-foreground"
                            />
                          </div>
                          <div className="checkout-field">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                              Transfer Amount
                            </Label>
                            <Input
                              type="number"
                              placeholder="Enter Amount"
                              value={userEnteredAmount}
                              onChange={(e) =>
                                setUserEnteredAmount(e.target.value)
                              }
                              className="border-primary bg-background font-bold h-12 text-foreground"
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          onClick={handleConfirmPayment}
                          className="w-full bg-primary text-primary-foreground font-bold h-12 uppercase hover:opacity-90"
                        >
                          Confirm Payment
                        </Button>
                      </div>
                    )}

                  {paymentConfirmed && (
                    <div className="mt-6 p-4 bg-primary text-primary-foreground font-bold text-center uppercase text-xs tracking-widest italic animate-in fade-in duration-500">
                      ✓ Payment Confirmed — Ready to Place Order
                    </div>
                  )}
                </section>
              </div>

              <div className="lg:col-span-1">
                <div className="checkout-summary sticky top-24 bg-card border border-border">
                  <h2 className="text-xl font-bold mb-4 text-foreground">
                    Order Summary
                  </h2>
                  <div className="space-y-4 mb-6">
                    {checkoutItems.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center">
                        <img
                          src={item.product?.image || item.image}
                          className="w-16 h-16 object-cover rounded-md bg-muted"
                          alt=""
                        />
                        <div className="flex-1 text-sm">
                          <p className="font-bold text-foreground">
                            {item.product?.name || item.name}
                          </p>
                          <p className="text-muted-foreground">
                            {item.size} / {item.color}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-foreground">
                          {(
                            (item.product?.price || item.price || 0) *
                            item.quantity
                          ).toLocaleString()}{" "}
                          ETB
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="text-foreground">
                        {subtotalETB.toLocaleString()} ETB
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Shipping</span>
                      <span className="text-foreground">
                        {shippingCost === 0 ? "Free" : `${shippingCost} ETB`}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-xl pt-4 border-t border-border mt-2 text-foreground">
                      <span>Total</span>
                      <span className="text-primary">
                        {finalTotal.toLocaleString()} ETB
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={!paymentConfirmed}
                    className={`w-full mt-8 h-12 font-bold uppercase transition-all ${
                      paymentConfirmed
                        ? "bg-primary text-primary-foreground hover:scale-[1.01]"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    Place Order
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
