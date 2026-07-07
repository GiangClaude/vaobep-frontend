import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ChevronDown, LogOut, Settings, User, Sparkles, ShieldCheck, Menu, X } from 'lucide-react';
import { useAuth } from '../../AuthContext';
import { getAvatarUrl } from '../../utils/imageHelper';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 

  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isDropdownOpen) setIsDropdownOpen(false); 
  };

  const navItems = [
    { label: 'Trang Chủ', to: '/homepage' },
    { label: 'Công Thức', to: '/recipes' },
    { label: 'Bài Viết', to: '/articles' },
    { label: 'Từ Điển', to: '/dish-map' },
  ];

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (searchValue.trim()) {
        navigate(`/search?keyword=${encodeURIComponent(searchValue)}`);
        setIsMobileMenuOpen(false); 
      }
    }
  };

  return (
    <header className="sticky top-0 bg-white shadow-[0_4px_20px_-10px_rgba(255,117,31,0.3)] border-b-2 border-orange-100 z-[1000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          <div className="flex items-center gap-2 lg:gap-4">
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-600 hover:text-[#ff751f] hover:bg-orange-50 rounded-full transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <div 
              className="flex-shrink-0 cursor-pointer group" 
              onClick={() => navigate('/homepage')}
            >
              <div className="flex items-center gap-2 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3">
                <img 
                  src="/assets/logo/1.png" 
                  alt="VaoBep Logo" 
                  className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-sm" 
                />
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center flex-1 justify-center px-4 lg:px-8">
            <nav className="flex gap-1 lg:gap-4 mr-4 lg:mr-8 whitespace-nowrap">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="text-gray-600 font-bold text-sm lg:text-base px-3 lg:px-4 py-2 rounded-full hover:bg-orange-50 hover:text-[#ff751f] transition-all duration-300 hover:-translate-y-0.5"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="relative w-full max-w-sm group">
              <input
                type="text"
                placeholder="Hôm nay ăn gì?"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full pl-5 pr-12 py-2 md:py-2.5 bg-orange-50/50 border-2 border-orange-100 rounded-full text-sm font-medium focus:outline-none focus:border-[#ff751f] focus:bg-white transition-all duration-300 placeholder-gray-400 shadow-inner"
              />
              <button 
                onClick={handleSearch}
                className="absolute right-1.5 top-1 md:top-1.5 p-1.5 bg-[#ff751f] text-white rounded-full hover:bg-yellow-400 hover:rotate-12 transition-all duration-300 shadow-md"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="hidden sm:flex items-center gap-1.5 bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full font-bold text-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="hidden lg:block">Trang Quản Lý</span>
                <span className="block lg:hidden">Admin</span>
              </button>
            )}

            {currentUser ? (
              <div className='relative'>
                <button 
                  onClick={() => { setIsDropdownOpen(!isDropdownOpen); setIsMobileMenuOpen(false); }}
                  className='flex items-center gap-2 md:gap-3 bg-white border-2 border-orange-100 hover:border-[#ff751f] p-1 md:pl-2 md:pr-3 md:py-1.5 rounded-full transition-all duration-300 hover:shadow-[0_4px_12px_rgba(255,117,31,0.2)]'
                >
                  <img
                    src={getAvatarUrl(currentUser.id, currentUser.avatar)}
                    alt={currentUser.fullName}
                    className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-bold text-gray-700 truncate max-w-[120px]">{currentUser.fullName}</p>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-[#ff751f]">{currentUser.role}</p>
                  </div>
                  <ChevronDown className={`hidden md:block w-4 h-4 text-[#ff751f] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl shadow-orange-900/10 border-2 border-orange-100 z-50 overflow-hidden transform origin-top-right transition-all">
                    {/* Header menu cho mobile */}
                    <div className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 border-b border-orange-100 md:hidden">
                      <p className="text-sm font-bold text-gray-800 flex items-center gap-1">
                        {currentUser.fullName} <Sparkles className="w-3 h-3 text-yellow-500"/>
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{currentUser.email}</p>
                    </div>
                    {/* Header menu cho Laptop */}
                    <div className="hidden md:block p-4 bg-gradient-to-br from-orange-50 to-yellow-50 border-b border-orange-100">
                      <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                    </div>

                    <div className="py-2 px-2 gap-1 flex flex-col">
                      
                      {currentUser?.role === 'admin' && (
                        <Link 
                          to="/admin/dashboard"
                          onClick={() => setIsDropdownOpen(false)}
                          className="sm:hidden w-full text-left px-3 py-2 text-sm font-bold text-red-500 rounded-xl hover:bg-red-50 transition-colors flex items-center gap-3"
                        >
                          <ShieldCheck className="w-4 h-4" /> 
                          Trang Quản Lý
                        </Link>
                      )}

                      <Link 
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full text-left px-3 py-2 text-sm font-semibold text-gray-600 rounded-xl hover:bg-orange-50 hover:text-[#ff751f] transition-colors flex items-center gap-3"
                      >
                        <User className="w-4 h-4" /> 
                        Hồ Sơ Của Tôi
                      </Link>
                      
                      <Link 
                        to="/settings"
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full text-left px-3 py-2 text-sm font-semibold text-gray-600 rounded-xl hover:bg-orange-50 hover:text-[#ff751f] transition-colors flex items-center gap-3"
                      >
                        <Settings className="w-4 h-4" /> 
                        Cài Đặt
                      </Link>
                      
                      <div className="h-px bg-orange-100 my-1 mx-2"></div>
                      
                      <button 
                        onClick={logout}
                        className="w-full text-left px-3 py-2 text-sm font-bold text-red-500 rounded-xl hover:bg-red-50 transition-colors flex items-center gap-3"
                      >
                        <LogOut className="w-4 h-4" /> 
                        Đăng Xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-4">
                <Link 
                  to="/login"
                  className="hidden md:block text-gray-600 font-bold text-sm px-4 py-2 rounded-full hover:text-[#ff751f] hover:bg-orange-50 transition-all duration-300"
                >
                  Đăng nhập
                </Link>
                <Link 
                  to="/register"
                  className="bg-gradient-to-r from-[#ff751f] to-yellow-400 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-full font-bold text-sm shadow-md shadow-orange-300/50 hover:shadow-lg hover:shadow-orange-400/50 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[100%] left-0 w-full bg-white border-b-2 border-orange-100 shadow-xl z-40 px-4 py-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          
          {/* Thanh tìm kiếm trên Mobile */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Hôm nay ăn gì nhỉ? 😋"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full pl-5 pr-12 py-2.5 bg-orange-50/50 border-2 border-orange-100 rounded-full text-sm font-medium focus:outline-none focus:border-[#ff751f] focus:bg-white transition-all duration-300 placeholder-gray-400"
            />
            <button 
              onClick={handleSearch}
              className="absolute right-1.5 top-1.5 p-1.5 bg-[#ff751f] text-white rounded-full"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Danh sách trang */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 font-bold text-base px-4 py-3 rounded-xl hover:bg-orange-50 hover:text-[#ff751f] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Nút Login hiển thị thêm nếu đang dùng điện thoại mà chưa đăng nhập */}
          {!currentUser && (
            <div className="border-t border-orange-100 pt-4 mt-2">
              <Link 
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-center text-gray-600 font-bold text-base px-4 py-3 rounded-xl hover:bg-orange-50 hover:text-[#ff751f] transition-colors"
              >
                Đăng nhập tài khoản
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;