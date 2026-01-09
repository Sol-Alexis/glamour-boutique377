import React from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext'; 
import { Package, ChevronRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toEthiopianDate } from '@/lib/ethiopianCalendar'; 
import './Orders.css';

const Orders = () => {
  const { user } = useAuth();
  const { orders } = useCart(); 
  const navigate = useNavigate();

  // --- THE FIX: Filter orders so users only see their own ---
  // We compare the order's customerEmail with the logged-in user's email
  const userOrders = orders.filter(
    (order: any) => order.customerEmail === user?.email
  );

  if (!user) {
    return (
      <Layout>
        <div className="orders-empty">
          <ShoppingBag size={48} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold mb-4">Please login to view your orders</h2>
          <Button onClick={() => navigate('/auth')} className="bg-black text-white">
            Go to Login
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="orders-page-wrapper">
      <div className="orders-container">
        <h1 className="orders-title">My Orders</h1>
        
        <div className="orders-list">
          {/* Use the filtered 'userOrders' instead of the global 'orders' */}
          {userOrders.length === 0 ? (
            <div className="orders-empty text-center py-20">
              <Package size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">You haven't placed any orders yet.</p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => navigate('/')}
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            userOrders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-icon">
                  <Package size={24} />
                </div>
                
                <div className="order-details">
                  <div className="order-main-info">
                    <span className="order-id font-bold">{order.id}</span>
                    <span className={`order-status ${order.status.toLowerCase().replace(' ', '-')}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <p className="order-meta text-sm text-gray-500">
                    {toEthiopianDate(new Date(order.date)).fullDate} • {order.items.length} Items
                  </p>

                  <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">
                    {order.items.map((item: any) => item.product?.name || item.name).join(', ')}
                  </div>
                </div>

                <div className="order-price">
                  <span className="font-bold">{order.total.toLocaleString()} ETB</span>
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default Orders;