import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Search,
  Eye,
  Download,
  TrendingUp,
  Package,
  DollarSign,
  List,
  Trash2,
  X,
  Edit2,
  Camera,
  AlertTriangle,
} from "lucide-react";
import { products as initialProducts } from "@/data/products";
import { useToast } from "@/hooks/use-toast";
import { isUserAdmin } from "@/config/admins";
import "./AdminOrders.css";

const GLAMOUR_CATEGORIES = [
  "Belts",
  "Caps_Hats",
  "FootWear",
  "Hoodies_Sweaters",
  "Jackets_Coats",
  "Jeans",
  "Shirts",
  "Shorts",
  "Suits_Tailoring",
  "Tshirts",
  "Underwear",
  "WaistCoats",
];

const AdminOrders = () => {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  const { orders, updateOrderStatus } = useCart();
  const navigate = useNavigate();
  const [adminProfile, setAdminProfile] = useState<{
    name?: string;
    image?: string;
    email?: string;
  }>(() => {
    const saved = localStorage.getItem("glamour_admin_profile");
    return saved
      ? JSON.parse(saved)
      : { name: "Admin", email: user?.email || "" };
  });

  const [activeTab, setActiveTab] = useState<"orders" | "products">("orders");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Modals & Selection
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [saveMessage, setSaveMessage] = useState("");

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem("glamour_inventory");
    if (saved) return JSON.parse(saved);
    return initialProducts.map((p) => ({
      ...p,
      stock: p.stock ?? 0,
      category: p.category || "all",
      department: p.department || "women",
      subcategory: p.subcategory || p.category,
    }));
  });

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setAllOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    );

    // Persist to localStorage
    const allOrdersKey = "glamour_orders_all";
    const savedAllOrders = localStorage.getItem(allOrdersKey);
    const allOrdersStored = savedAllOrders ? JSON.parse(savedAllOrders) : [];
    const updatedAllOrders = allOrdersStored.map((o: Order) =>
      o.id === orderId ? { ...o, status: newStatus } : o,
    );
    localStorage.setItem(allOrdersKey, JSON.stringify(updatedAllOrders));
  };

  useEffect(() => {
    if (!user || !isUserAdmin(user.email)) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Admin privileges required.",
      });
      navigate("/");
    }
  }, [user, navigate, toast]);

  useEffect(() => {
    localStorage.setItem("glamour_inventory", JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    const savedAllOrders = localStorage.getItem("glamour_orders_all");
    setAllOrders(savedAllOrders ? JSON.parse(savedAllOrders) : []);
  }, []);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "glamour_orders_all") {
        setAllOrders(e.newValue ? JSON.parse(e.newValue) : []);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    const loadProfile = () => {
      const savedProfile = localStorage.getItem("glamour_admin_profile");
      if (savedProfile) setAdminProfile(JSON.parse(savedProfile));
    };

    // Initial load
    loadProfile();

    // Listen for updates
    window.addEventListener("storage", loadProfile);
    return () => window.removeEventListener("storage", loadProfile);
  }, []);

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Tshirts",
    price: "",
    image: "",
    department: "women",
    stock: 0,
  });

  const toEthiopianDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const timestamp = date.getTime();
      const gregorianYear = date.getFullYear();
      let ethiopianYear = gregorianYear - 8;
      const newYearSept11 = new Date(gregorianYear, 8, 11).getTime();
      if (timestamp >= newYearSept11) ethiopianYear = gregorianYear - 7;
      const months = [
        "Meskerem",
        "Tikimt",
        "Hidar",
        "Tahsas",
        "Tir",
        "Yekatit",
        "Megabit",
        "Miazia",
        "Ginbot",
        "Sene",
        "Hamle",
        "Nehasse",
        "Pagume",
      ];
      const startOfYear = new Date(gregorianYear, 8, 11);
      if (timestamp < startOfYear.getTime())
        startOfYear.setFullYear(gregorianYear - 1);
      const diffDays = Math.floor(
        (timestamp - startOfYear.getTime()) / (1000 * 60 * 60 * 24),
      );
      const ethiopianMonth = months[Math.floor(diffDays / 30)] || "Meskerem";
      const ethiopianDay = (diffDays % 30) + 1;
      return `${ethiopianDay}, ${ethiopianMonth}, ${ethiopianYear} E.C.`;
    } catch (e) {
      return "Invalid Date";
    }
  };

  const totalRevenue = allOrders.reduce((acc, order) => acc + order.total, 0);
  const pendingOrders = allOrders.filter(
    (o) => o.status === "Processing",
  ).length;

  const updatePrice = (id: string | number, newPrice: string) => {
    const priceNum = parseFloat(newPrice);
    if (isNaN(priceNum)) return;
    setInventory((prev: any[]) =>
      prev.map((item) =>
        String(item.id) === String(id) ? { ...item, price: priceNum } : item,
      ),
    );
    window.dispatchEvent(new Event("storage")); // SYNC FIX
    toast({ title: "Price Saved" });
  };

  const updateStock = (id: string | number, newStock: string) => {
    const stockNum = parseInt(newStock);
    if (isNaN(stockNum)) return;
    setInventory((prev: any[]) =>
      prev.map((item) =>
        String(item.id) === String(id)
          ? { ...item, stock: Math.max(0, stockNum) }
          : item,
      ),
    );
    window.dispatchEvent(new Event("storage")); // SYNC FIX
    toast({ title: "Stock Updated" });
  };

  const deleteProduct = (id: string | number) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      setInventory((prev: any[]) =>
        prev.filter((p) => String(p.id) !== String(id)),
      );
      window.dispatchEvent(new Event("storage")); // SYNC FIX
      toast({ variant: "destructive", title: "Deleted" });
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const productToAdd = {
      id: Date.now().toString(),
      name: newProduct.name,
      price: parseFloat(newProduct.price) || 0,
      image: newProduct.image,
      stock: parseInt(newProduct.stock.toString()) || 0,
      department: newProduct.department.toLowerCase(),
      category: newProduct.category,
      subcategory: newProduct.category,
      status: "active",
    };
    setInventory([productToAdd, ...inventory]);
    window.dispatchEvent(new Event("storage")); // SYNC FIX
    setIsModalOpen(false);
    setNewProduct({
      name: "",
      category: "Tshirts",
      price: "",
      image: "",
      department: "women",
      stock: 0,
    });
    toast({ title: "Product Added" });
  };

  const filteredOrders = useMemo(
    () =>
      allOrders.filter((order) =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [allOrders, searchTerm],
  );

  const filteredProducts = useMemo(
    () =>
      inventory.filter((p: any) => {
        const name = p.name || "";
        const matchesSearch = name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const activeFilter = categoryFilter.toLowerCase();
        const productDept = (p.department || p.category || "").toLowerCase();
        const matchesCategory =
          activeFilter === "all" || productDept === activeFilter;
        return matchesSearch && matchesCategory;
      }),
    [inventory, searchTerm, categoryFilter],
  );

  return (
    <Layout>
      <div className="admin-wrapper">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Boutique Manager</h1>
            <p className="admin-subtitle">
              Managing Glamour Boutique Ethiopia.
            </p>
          </div>

          {/* ---------- Admin Profile + Buttons ---------- */}
          <div className="flex items-center gap-6 mb-10 pb-4">
            <div className="flex items-center gap-3">
              <img
                src={adminProfile.image || "/default-avatar.jfif"}
                alt="Admin"
                className="w-8 h-8 rounded-full object-cover border"
              />
              <div className="flex flex-col leading-tight">
                <span className="font-semibold text-sm">
                  {adminProfile.name || "Admin"}
                </span>
                {adminProfile.email && (
                  <span className="text-xs text-muted-foreground">
                    {adminProfile.email}
                  </span>
                )}
              </div>
            </div>

            <div className="ml-auto flex flex-col space-y-4">
              {/* Edit Profile */}
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>

              {/* Print Report */}
              <Button
                className="download-btn"
                variant="outline"
                onClick={() => window.print()}
              >
                <Download size={18} /> Print Report
              </Button>

              {activeTab === "products" && (
                <Button onClick={() => setIsModalOpen(true)}>
                  + Add Product
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* ---------- Edit Profile Modal ---------- */}
        {isEditing && (
          <div className="modal-overlay fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="modal-content bg-white p-6 pb-8 rounded-md w-80 relative">
              <button
                onClick={() => setIsEditing(false)}
                className="absolute top-3 right-3"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={adminProfile.name || ""}
                    onChange={(e) =>
                      setAdminProfile({
                        ...adminProfile,
                        name: e.target.value,
                      })
                    }
                    className="border rounded px-2 py-1 w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setAdminProfile({
                          ...adminProfile,
                          image: reader.result as string,
                        });
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="w-full"
                  />
                </div>

                <div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      localStorage.setItem(
                        "glamour_admin_profile",
                        JSON.stringify(adminProfile),
                      );
                      setSaveMessage("Profile Updated!");
                      setTimeout(() => {
                        setSaveMessage("");
                        setIsEditing(false); // close modal
                      }, 1500);
                    }}
                  >
                    Save
                  </Button>
                  {saveMessage && (
                    <p className="text-green-600 font-medium mt-2 text-center">
                      {saveMessage}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon rev">ETB</div>
            <div>
              <p className="stat-label">Total Revenue</p>
              <h3 className="stat-value">
                {totalRevenue.toLocaleString()} ETB
              </h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon ord">
              <Package size={20} />
            </div>
            <div>
              <p className="stat-label">Orders</p>
              <h3 className="stat-value">{allOrders.length}</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon pen">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="stat-label">To Process</p>
              <h3 className="stat-value">{pendingOrders}</h3>
            </div>
          </div>
        </div>

        <div className="admin-nav-row">
          <div className="tab-menu">
            <button
              className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              <Package size={18} /> Orders
            </button>
            <button
              className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
              onClick={() => setActiveTab("products")}
            >
              <List size={18} /> Inventory
            </button>
          </div>

          {activeTab === "products" && (
            <div className="category-pills">
              {["All", "Women", "Men", "Kids"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`pill ${categoryFilter === cat ? "active" : ""}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="admin-actions">
          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder={
                activeTab === "orders"
                  ? "Search Order ID..."
                  : "Search products..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search"
            />
          </div>
        </div>

        <div className="table-container">
          {activeTab === "orders" ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date (E.C.)</th>
                  <th>Items</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="order-id">#{order.id}</td>
                    <td>{toEthiopianDate(order.date)}</td>
                    <td>
                      <div className="item-avatars flex items-center gap-1">
                        {order.items.slice(0, 2).map((item: any, i: number) => (
                          <img
                            key={i}
                            src={item.product?.image || item.image}
                            alt=""
                            className="w-8 h-8 rounded object-cover border border-border"
                          />
                        ))}
                        {order.items.length > 2 && (
                          <span className="text-xs font-bold opacity-60">
                            +{order.items.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="font-bold">
                      {order.total.toLocaleString()} ETB
                    </td>
                    <td>
                      <select
                        className="status-select"
                        value={order.status}
                        onChange={(e) =>
                          handleUpdateOrderStatus(order.id, e.target.value)
                        }
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                    <td>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price (ETB)</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p: any) => {
                  const stockValue = parseInt(p.stock) || 0;
                  const isLowStock = stockValue <= 1;
                  return (
                    <tr
                      key={p.id}
                      className={isLowStock ? "bg-destructive/5" : ""}
                    >
                      <td>
                        <div className="flex items-center gap-4">
                          <img
                            src={p.image}
                            alt=""
                            className="w-10 h-10 rounded object-cover border border-border"
                          />
                          <div>
                            <span className="font-medium block">{p.name}</span>
                            {isLowStock && (
                              <span className="text-[10px] font-bold text-destructive uppercase flex items-center gap-1">
                                <AlertTriangle size={10} />{" "}
                                {stockValue === 0
                                  ? "Out of Stock"
                                  : "Low Stock"}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{(p.category || "All").replace("_", " & ")}</td>
                      <td>
                        <input
                          type="number"
                          defaultValue={p.price}
                          onBlur={(e) => updatePrice(p.id, e.target.value)}
                          className="w-20 bg-transparent border-b border-border focus:border-primary outline-none font-bold"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className={`w-16 p-1 rounded bg-muted/50 font-bold ${
                            isLowStock ? "text-destructive" : ""
                          }`}
                          defaultValue={p.stock}
                          onBlur={(e) => updateStock(p.id, e.target.value)}
                        />
                      </td>
                      <td>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => deleteProduct(p.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        {selectedOrder && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="flex justify-between items-center border-b border-border pb-4 mb-4">
                <h2 className="font-bold text-xl">
                  Order Receipt #{selectedOrder.id}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 hover:bg-muted rounded-full transition-colors"
                >
                  <X />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="opacity-60">Date:</span>
                  <span>{toEthiopianDate(selectedOrder.date)}</span>
                </div>

                {/* ------------------ Customer Info ------------------ */}
                <div className="user-info-section p-4 rounded-md border border-border bg-muted/20 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="opacity-60">Customer Name:</span>
                    <span>{selectedOrder.customerName || "Guest User"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-60">Email:</span>
                    <span>{selectedOrder.customerEmail || "N/A"}</span>
                  </div>
                  {selectedOrder.customerPhone && (
                    <div className="flex justify-between text-sm">
                      <span className="opacity-60">Phone:</span>
                      <span>{selectedOrder.customerPhone}</span>
                    </div>
                  )}
                  {selectedOrder.customerAddress && (
                    <div className="flex justify-between text-sm">
                      <span className="opacity-60">Address:</span>
                      <span>{selectedOrder.customerAddress}</span>
                    </div>
                  )}
                </div>

                {/* ------------------ Ordered Items ------------------ */}
                <div className="py-4 border-y border-border space-y-3">
                  {selectedOrder.items.map((item: any, i: number) => (
                    <div
                      key={i}
                      className="flex justify-between items-center text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product?.image || item.image}
                          alt=""
                          className="w-10 h-10 rounded object-cover"
                        />
                        <span>
                          {item.product?.name || item.name}{" "}
                          <strong className="opacity-60">
                            x{item.quantity}
                          </strong>
                        </span>
                      </div>
                      <span className="font-bold">
                        {(item.product?.price || item.price).toLocaleString()}{" "}
                        ETB
                      </span>
                    </div>
                  ))}
                </div>

                {/* ------------------ Total ------------------ */}
                <div className="flex justify-between font-black text-xl pt-2">
                  <span>TOTAL</span>
                  <span>{selectedOrder.total.toLocaleString()} ETB</span>
                </div>
              </div>

              <Button className="w-full mt-8" onClick={() => window.print()}>
                Print Delivery Note
              </Button>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              {/* Close button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="close-circle"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-black uppercase tracking-tighter text-center mb-6">
                New Boutique Item
              </h2>

              <form onSubmit={handleAddProduct} className="form-full">
                <label className="text-[10px] font-bold uppercase opacity-50 mb-1">
                  Product Name
                </label>
                <input
                  required
                  type="text"
                  className="luxury-input"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />

                <label className="text-[10px] font-bold uppercase opacity-50 mb-1">
                  Department
                </label>
                <select
                  className="luxury-input"
                  value={newProduct.department}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, department: e.target.value })
                  }
                >
                  <option value="women">Women</option>
                  <option value="men">Men</option>
                  <option value="kids">Kids</option>
                </select>

                <label className="text-[10px] font-bold uppercase opacity-50 mb-1">
                  Category
                </label>
                <select
                  className="luxury-input scrollable"
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                >
                  {GLAMOUR_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c.replace("_", " & ")}
                    </option>
                  ))}
                </select>

                <label className="text-[10px] font-bold uppercase opacity-50 mb-1">
                  Price (ETB)
                </label>
                <input
                  required
                  type="number"
                  className="luxury-input"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                />

                <label className="text-[10px] font-bold uppercase opacity-50 mb-1">
                  Stock
                </label>
                <input
                  required
                  type="number"
                  className="luxury-input"
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      stock: parseInt(e.target.value) || 0,
                    })
                  }
                />

                <label className="text-[10px] font-bold uppercase opacity-50 mb-1">
                  Image URL
                </label>
                <input
                  required
                  type="text"
                  className="luxury-input"
                  value={newProduct.image}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image: e.target.value })
                  }
                />
                <div className="flex justify-center mt-4">
                  <Button
                    type="submit"
                    className="w-28 h-10 font-bold text-lg mt-4 bg-red-600 text-white hover:bg-red-700"
                  >
                    Publish to Boutique
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminOrders;
