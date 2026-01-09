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
  const { orders, updateOrderStatus } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"orders" | "products">("orders");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem("glamour_inventory");
    if (saved) return JSON.parse(saved);
    return initialProducts.map((p) => ({
      ...p,
      stock: p.stock ?? 10,
      category: p.category || "all",
      department: p.department || "women",
      subcategory: p.subcategory || p.category,
    }));
  });

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

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Tshirts",
    price: "",
    image: "",
    department: "women",
    stock: "10",
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
        (timestamp - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
      );
      const ethiopianMonth = months[Math.floor(diffDays / 30)] || "Meskerem";
      const ethiopianDay = (diffDays % 30) + 1;
      return `${ethiopianDay}, ${ethiopianMonth}, ${ethiopianYear} E.C.`;
    } catch (e) {
      return "Invalid Date";
    }
  };

  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "Processing").length;

  const updatePrice = (id: string | number, newPrice: string) => {
    const priceNum = parseFloat(newPrice);
    if (isNaN(priceNum)) return;
    setInventory((prev: any[]) =>
      prev.map((item) =>
        String(item.id) === String(id) ? { ...item, price: priceNum } : item
      )
    );
    toast({ title: "Price Saved" });
  };

  const updateStock = (id: string | number, newStock: string) => {
    const stockNum = parseInt(newStock);
    if (isNaN(stockNum)) return;
    setInventory((prev: any[]) =>
      prev.map((item) =>
        String(item.id) === String(id) ? { ...item, stock: stockNum } : item
      )
    );
    toast({ title: "Stock Updated" });
  };

  const deleteProduct = (id: string | number) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      setInventory((prev: any[]) =>
        prev.filter((p) => String(p.id) !== String(id))
      );
      toast({ variant: "destructive", title: "Deleted" });
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const productToAdd = {
      id: Date.now(),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      image: newProduct.image,
      stock: parseInt(newProduct.stock),
      department: newProduct.department.toLowerCase(),
      category: newProduct.category,
      subcategory: newProduct.category,
      status: "active",
    };
    setInventory([productToAdd, ...inventory]);
    setIsModalOpen(false);
    setNewProduct({
      name: "",
      category: "Tshirts",
      price: "",
      image: "",
      department: "women",
      stock: "10",
    });
    toast({ title: "Product Added" });
  };

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [orders, searchTerm]
  );

  const filteredProducts = useMemo(
    () =>
      inventory.filter((p: any) => {
        const matchesSearch = p.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const activeFilter = categoryFilter.toLowerCase();
        const productDept = (p.department || p.category || "").toLowerCase();
        const matchesCategory =
          activeFilter === "all" || productDept === activeFilter;
        return matchesSearch && matchesCategory;
      }),
    [inventory, searchTerm, categoryFilter]
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
          <div className="flex gap-2">
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
              <h3 className="stat-value">{orders.length}</h3>
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
                          updateOrderStatus(order.id, e.target.value)
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
                  const isLowStock = Number(p.stock) <= 1;
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
                                {p.stock === 0 ? "Out of Stock" : "Low Stock"}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{(p.category || "All").replace("_", " & ")}</td>
                      <td>
                        <input
                          type="number"
                          defaultValue={p.price.toFixed(0)}
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

        {/* Selected Order Receipt Modal */}
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
                <div className="flex justify-between text-sm">
                  <span className="opacity-60">Customer:</span>
                  <span>{selectedOrder.customerName || "Guest User"}</span>
                </div>

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

        {/* Add Product Modal */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black uppercase tracking-tighter">
                  New Boutique Item
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 bg-muted rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase opacity-50 block mb-1">
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
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase opacity-50 block mb-1">
                      Department
                    </label>
                    <select
                      className="luxury-input"
                      value={newProduct.department}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          department: e.target.value,
                        })
                      }
                    >
                      <option value="women">Women</option>
                      <option value="men">Men</option>
                      <option value="kids">Kids</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase opacity-50 block mb-1">
                      Category
                    </label>
                    <select
                      className="luxury-input"
                      value={newProduct.category}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          category: e.target.value,
                        })
                      }
                    >
                      {GLAMOUR_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c.replace("_", " & ")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase opacity-50 block mb-1">
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
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase opacity-50 block mb-1">
                      Stock
                    </label>
                    <input
                      required
                      type="number"
                      className="luxury-input"
                      value={newProduct.stock}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, stock: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase opacity-50 block mb-1">
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
                </div>
                <Button type="submit" className="w-full h-14 font-bold text-lg">
                  Publish to Boutique
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminOrders;
