import React, { useState } from 'react';
import { products as initialProducts } from '@/data/products';
import { Package, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminProducts = () => {
  const [inventory, setInventory] = useState(initialProducts);
  const { toast } = useToast();

  const toggleStatus = (id: number | string) => {
    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, status: item.status === 'active' ? 'hidden' : 'active' } : item
    ));
    toast({ title: "Status Updated", description: "Product visibility has been toggled." });
  };

  const handlePriceChange = (id: number | string, newPrice: string) => {
    const priceNum = parseFloat(newPrice);
    if (isNaN(priceNum)) return;

    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, price: priceNum } : item
    ));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Package className="text-gray-600" /> Inventory Manager
        </h2>
        <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
          + Add New Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Product</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Category</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Price (ETB)</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((product) => (
              <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <img src={product.image} alt="" className="w-10 h-10 rounded-md object-cover border" />
                  <span className="font-medium text-gray-900">{product.name}</span>
                </td>
                <td className="p-4 text-sm text-gray-600">{product.category}</td>
                <td className="p-4">
                  <input 
                    type="number" 
                    defaultValue={(product.price).toFixed(0)} 
                    onBlur={(e) => handlePriceChange(product.id, e.target.value)}
                    className="w-24 border border-gray-200 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-black outline-none"
                  />
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    product.status !== 'hidden' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {product.status !== 'hidden' ? 'Live' : 'Hidden'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => toggleStatus(product.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                      title="Toggle Visibility"
                    >
                      {product.status !== 'hidden' ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded-lg text-red-500" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;