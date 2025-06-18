import React, { useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { navigationItems } from '../../routes/navConfig';
import logoImage from '../../assets/images/eth_logo.png';
import { 
  BellIcon, 
  SearchIcon, 
  LogoutIcon, 
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/outline';

const Header: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderNavItems = (items = navigationItems) => {
    return items.map((item) => {
      const isActive = location.pathname === item.path;
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expandedMenus.includes(item.id);
      
      // Check if any child is active
      const isChildActive = hasChildren && item.children?.some(
        child => location.pathname === child.path
      );

      return (
        <div key={item.id} className="relative group">
          {hasChildren ? (
            <>
              <button
                onClick={() => toggleMenu(item.id)}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isChildActive 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span>{item.title}</span>
                {isExpanded ? (
                  <ChevronUpIcon className="ml-1 h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                )}
              </button>
              
              <div 
                className={`absolute left-0 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 ${
                  isExpanded ? 'block' : 'hidden group-hover:block'
                }`}
              >
                <div className="py-1">
                  {item.children?.map((child) => {
                    const isChildItemActive = location.pathname === child.path;
                    
                    return (
                      <Link
                        key={child.id}
                        to={child.path || '#'}
                        className={`block px-4 py-2 text-sm ${
                          isChildItemActive 
                            ? 'bg-gray-100 text-indigo-600 font-medium' 
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        {child.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <Link
              to={item.path || '#'}
              className={`block px-4 py-2 text-sm font-medium rounded-md ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {item.title}
            </Link>
          )}
        </div>
      );
    });
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                className="mx-auto h-10 w-auto"
                src={logoImage}
                alt="ETH Logo"
              />
              <span className="text-xl font-bold text-gray-800">
                ETH Deployer
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:ml-6 md:flex md:space-x-1">
              {renderNavItems()}
            </nav>
          </div>
          
          <div className="hidden md:ml-4 md:flex md:items-center">
            <div className="relative mx-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Search..."
              />
            </div>
            
            <button className="p-1 rounded-full text-gray-500 hover:bg-gray-100 relative">
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
            
            <div className="ml-3 relative" ref={dropdownRef}>
              <button 
                onClick={toggleDropdown}
                className="flex items-center focus:outline-none"
              >
                <img
                  src="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
                  alt="User"
                  className="h-8 w-8 rounded-full"
                />
              </button>
              
              {dropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogoutIcon className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1 bg-white">
          {renderNavItems()}
          
          <div className="px-4 py-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Search..."
              />
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 pb-3">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <img
                  className="h-10 w-10 rounded-full"
                  src="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
                  alt=""
                />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">User Name</div>
                <div className="text-sm font-medium text-gray-500">user@example.com</div>
              </div>
              <button className="ml-auto flex-shrink-0 p-1 rounded-full text-gray-500 hover:bg-gray-100">
                <BellIcon className="h-6 w-6" />
                <span className="sr-only">View notifications</span>
              </button>
            </div>
            <div className="mt-3 space-y-1">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                <LogoutIcon className="h-5 w-5 mr-2 text-gray-400" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;