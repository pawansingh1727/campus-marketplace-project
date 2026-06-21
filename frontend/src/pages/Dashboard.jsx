import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../utils/api.js';
import { toast } from 'react-toastify';
import { PlusCircle, Edit, Trash2, Package } from 'lucide-react';

const Dashboard = () => {
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const { data } = await api.get('/products'); 
        const mine = data.products.filter(p => p.seller._id === userInfo._id);
        setMyProducts(mine);
      } catch (error) {
        toast.error('Failed to load your items');
      } finally {
        setLoading(false);
      }
    };
    if (userInfo) {
      fetchMyProducts();
    }
  }, [userInfo]);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/products/${id}`);
        setMyProducts(myProducts.filter((p) => p._id !== id));
        toast.success('Item deleted');
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Delete failed');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">My Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your listed items</p>
        </div>
        <Link to="/add-item" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-sm">
          <PlusCircle className="h-5 w-5" />
          Sell New Item
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : myProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No items listed yet</h3>
          <p className="text-gray-500 mb-6">Start selling your old textbooks, electronics, and more.</p>
          <Link to="/add-item" className="text-blue-600 font-bold hover:underline">List your first item</Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {myProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        <img className="h-12 w-12 object-cover" src={product.images[0] || 'https://via.placeholder.com/50'} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-gray-900">{product.title}</div>
                        <div className="text-sm text-gray-500">{product.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">${product.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${product.isSold ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {product.isSold ? 'Sold' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/edit-item/${product._id}`} className="text-blue-600 hover:text-blue-900 mr-4 inline-flex items-center gap-1">
                      <Edit className="h-4 w-4" /> Edit
                    </Link>
                    <button onClick={() => deleteHandler(product._id)} className="text-red-600 hover:text-red-900 inline-flex items-center gap-1">
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
