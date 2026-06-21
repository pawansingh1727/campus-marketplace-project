import { useState, useEffect } from 'react';
import api from '../utils/api.js';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, ShoppingBag } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');

  const fetchProducts = async () => {
    try {
      const { data } = await api.get(`/products?keyword=${keyword}&category=${category}`);
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-10 md:p-14 text-white mb-12 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-5 tracking-tight">Your Campus <br/><span className="text-blue-200">Marketplace</span></h1>
          <p className="text-lg md:text-xl opacity-90 mb-10 max-w-2xl font-light">Buy and sell textbooks, electronics, and furniture with other students safely and easily.</p>
          
          <form onSubmit={handleSearch} className="flex max-w-3xl bg-white rounded-2xl p-1.5 shadow-2xl">
            <div className="flex items-center pl-4 pr-2">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search for items..." 
              className="flex-grow px-2 py-3 text-gray-900 focus:outline-none text-lg font-medium bg-transparent"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit" className="bg-blue-600 hover:bg-indigo-600 text-white px-8 py-3 rounded-xl flex items-center gap-2 font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-extrabold text-xl mb-5 text-gray-900">Categories</h3>
            <div className="space-y-2">
              {['', 'Books', 'Electronics', 'Furniture', 'Notes', 'Others'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex items-center justify-between w-full text-left px-4 py-3 rounded-xl transition-all font-medium ${category === cat ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <span>{cat || 'All Items'}</span>
                  {category === cat && <ChevronRight className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link to={`/product/${product._id}`} key={product._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col transform hover:-translate-y-1">
              <div className="h-56 overflow-hidden bg-gray-50 relative">
                <img src={product.images[0] || 'https://via.placeholder.com/300?text=No+Image'} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out" />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur shadow-sm text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full">
                  {product.condition}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-sm text-blue-600 font-bold mb-2 uppercase tracking-wider">{product.category}</p>
                <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2 leading-tight">{product.title}</h3>
                <div className="mt-auto pt-4 flex justify-between items-end">
                  <span className="text-3xl font-extrabold text-gray-900">${product.price}</span>
                  <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">{product.seller?.name || 'Student'}</span>
                </div>
              </div>
            </Link>
          ))}
          {products.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
              <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
