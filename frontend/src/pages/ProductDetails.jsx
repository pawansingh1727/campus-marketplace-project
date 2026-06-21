import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../utils/api.js';
import { toast } from 'react-toastify';
import { ShoppingCart, MessageSquare, ArrowLeft, Tag, ShieldCheck, Edit } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        toast.error('Product not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleChat = () => {
    if (!userInfo) {
      toast.info('Please login to message the seller');
      navigate('/login');
      return;
    }
    navigate(`/chat?user=${product.seller._id}`);
  };

  const handleCheckout = () => {
    if (!userInfo) {
      toast.info('Please login to purchase');
      navigate('/login');
      return;
    }
    navigate(`/checkout/${product._id}`);
  };

  if (loading) return <div className="text-center py-20 font-bold text-gray-500">Loading product...</div>;
  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to listings
      </Link>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
        <div className="md:w-1/2 bg-gray-50 p-8 flex items-center justify-center">
          <img src={product.images[0] || 'https://via.placeholder.com/600'} alt={product.title} className="max-h-[500px] object-contain rounded-2xl shadow-sm mix-blend-multiply" />
        </div>
        
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-2 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              {product.category}
            </span>
            <span className="bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Tag className="h-3 w-3" /> {product.condition}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{product.title}</h1>
          <div className="text-4xl font-extrabold text-blue-600 mb-6">${product.price}</div>
          
          <div className="prose prose-blue mb-8">
            <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 mb-8 border border-gray-100 flex items-center gap-4">
            <div className="bg-white p-3 rounded-xl shadow-sm text-blue-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Sold by</p>
              <p className="font-bold text-gray-900">{product.seller.name}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            {product.isSold ? (
              <button disabled className="w-full bg-gray-300 text-gray-600 font-bold py-4 rounded-xl cursor-not-allowed">
                Out of Stock / Sold
              </button>
            ) : userInfo?._id === product.seller._id ? (
              <Link to={`/edit-item/${product._id}`} className="w-full bg-blue-100 text-blue-700 hover:bg-blue-200 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                <Edit className="h-5 w-5" /> Edit Your Item
              </Link>
            ) : (
              <>
                <button onClick={handleCheckout} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                  <ShoppingCart className="h-5 w-5" /> Buy Now
                </button>
                <button onClick={handleChat} className="flex-1 bg-white border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 text-gray-700 font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2">
                  <MessageSquare className="h-5 w-5" /> Message Seller
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
