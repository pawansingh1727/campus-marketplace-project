import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api.js';
import { toast } from 'react-toastify';
import { Package, ExternalLink } from 'lucide-react';
import moment from 'moment';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
      } catch (error) {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">My Orders</h1>
      <p className="text-gray-500 mb-8">View your purchase history</p>

      {loading ? (
        <div className="text-center py-10 font-bold">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-6">You haven't bought any items yet.</p>
          <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold inline-block hover:bg-blue-700 transition-colors">Start Shopping</Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-5 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">Order ID & Date</th>
                  <th className="px-6 py-5 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-5 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">Seller</th>
                  <th className="px-6 py-5 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-5 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">#{order._id.substring(0, 8).toUpperCase()}</div>
                      <div className="text-xs text-gray-500 mt-1">{moment(order.createdAt).format('MMM D, YYYY')}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 shrink-0 rounded-lg overflow-hidden">
                          <img className="h-full w-full object-cover" src={order.product?.images[0] || 'https://via.placeholder.com/50'} alt="" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-bold text-gray-900 line-clamp-1 max-w-[200px]">{order.product?.title || 'Item Deleted'}</div>
                          {order.product && (
                            <Link to={`/product/${order.product._id}`} className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1">
                              View Item <ExternalLink className="h-3 w-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.seller?.name || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">${order.price}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${order.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {order.paymentStatus.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
