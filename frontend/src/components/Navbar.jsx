import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';
import { ShoppingBag, LogOut, User, PlusCircle, MessageSquare } from 'lucide-react';

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <ShoppingBag className="h-8 w-8 text-blue-600" />
              <span className="font-extrabold text-2xl tracking-tight text-gray-900">CampusCart</span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            {userInfo ? (
              <>
                <Link to="/add-item" className="text-gray-600 hover:text-blue-600 flex items-center gap-1.5 transition-colors font-medium">
                  <PlusCircle className="h-5 w-5" />
                  <span className="hidden sm:inline">Sell</span>
                </Link>
                <Link to="/chat" className="text-gray-600 hover:text-blue-600 flex items-center gap-1.5 transition-colors font-medium">
                  <MessageSquare className="h-5 w-5" />
                  <span className="hidden sm:inline">Messages</span>
                </Link>
                <div className="relative group py-2">
                  <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium">
                    <div className="bg-blue-100 p-1.5 rounded-full text-blue-700">
                      <User className="h-5 w-5" />
                    </div>
                    <span>{userInfo.name}</span>
                  </button>
                  <div className="absolute right-0 top-full pt-1 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-white rounded-xl shadow-xl py-2 border border-gray-100">
                      <Link to="/dashboard" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-medium transition-colors">Dashboard</Link>
                      <Link to="/orders" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-medium transition-colors">My Orders</Link>
                      <div className="h-px bg-gray-100 my-1"></div>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium transition-colors">
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Login</Link>
                <Link to="/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 font-medium transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
