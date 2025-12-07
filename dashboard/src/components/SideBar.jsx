import React, { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Grid3x3,
  Tag,
  ShoppingCart,
  Users,
  RefreshCw,
  Store,
  DollarSign,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  HelpCircle
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const SideBar = ({ isOpen, setIsOpen }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close sidebar on route change (mobile)
  React.useEffect(() => {
    if (window.innerWidth < 768 && setIsOpen) {
      setIsOpen(false);
    }
  }, [location.pathname, setIsOpen]);

  // Combined classes for mobile drawer vs desktop sidebar
  const sidebarClasses = `
    flex flex-col h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
    transition-all duration-300 ease-in-out z-50
    ${/* Mobile: Fixed overlay */ ''}
    fixed inset-y-0 left-0 md:relative
    ${/* Width logic */ ''}
    ${collapsed ? 'w-20' : 'w-72'}
    ${/* Mobile open/close transform */ ''}
    ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
  `;

  const adminMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Package, label: "Products", path: "/products" },
    { icon: Grid3x3, label: "Categories", path: "/categories" },
    { icon: Tag, label: "Brands", path: "/brands" },
    { icon: ShoppingCart, label: "Orders", path: "/orders" },
    { icon: Users, label: "Customers", path: "/customers" },
    { icon: RefreshCw, label: "Refunds", path: "/refunds" },
    { icon: Store, label: "Sellers", path: "/sellers" },
  ];

  const vendorMenuItems = [
    { icon: DollarSign, label: "Earnings", path: "/earnings" },
    { icon: RefreshCw, label: "Refund Request", path: "/refund-request" },
    { icon: MessageSquare, label: "Reviews", path: "/reviews" },
    { icon: Settings, label: "Shop Setting", path: "/shop-setting" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={sidebarClasses}>
      {/* Header / Logo */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Store className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              ReShop
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`
            p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors
            ${collapsed ? 'mx-auto' : ''}
          `}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">

        {/* Admin Section */}
        <div>
          {!collapsed && (
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
              Admin Area
            </h3>
          )}
          <nav className="space-y-1.5">
            {adminMenuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                  ${isActive(item.path)
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }
                  ${collapsed ? 'justify-center' : ''}
                `}
                title={collapsed ? item.label : ''}
              >
                <item.icon
                  size={20}
                  className={`
                    ${isActive(item.path) ? 'text-white' : 'text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'}
                  `}
                />
                {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        {/* Vendor Section */}
        <div>
          {!collapsed && (
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
              Vendor Area
            </h3>
          )}
          <nav className="space-y-1.5">
            {vendorMenuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                  ${isActive(item.path)
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }
                  ${collapsed ? 'justify-center' : ''}
                `}
                title={collapsed ? item.label : ''}
              >
                <item.icon
                  size={20}
                  className={`
                    ${isActive(item.path) ? 'text-white' : 'text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'}
                  `}
                />
                {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
        <button
          className={`
             w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200
             ${collapsed ? 'justify-center' : ''}
           `}
        >
          <HelpCircle size={20} />
          {!collapsed && <span className="font-medium text-sm">Help & Support</span>}
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
