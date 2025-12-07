import {
  X,
  Home,
  Package,
  Info,
  HelpCircle,
  ShoppingCart,
  List,
  Phone,
  LogOut,
  User,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar, toggleAuthPopup, toggleProfilePanel } from "../../store/slices/popupSlice";
import { logout } from "../../store/slices/authSlice";
import CategoriesSidebar from "./CategoriesSidebar";

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isSidebarOpen } = useSelector((state) => state.popup);
  const { authUser } = useSelector((state) => state.auth);

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Package, label: "Products", path: "/products" },
    { icon: Info, label: "About Us", path: "/about" },
    { icon: Phone, label: "Contact", path: "/contact" },
    { icon: HelpCircle, label: "FAQ", path: "/faq" },
  ];

  if (authUser) {
    navItems.push({ icon: List, label: "My Orders", path: "/orders" });
  }

  const handleLinkClick = () => {
    dispatch(toggleSidebar());
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(toggleSidebar());
  };

  return (
    <>
      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-50 h-full w-64 transform bg-background shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${isSidebarOpen ? "translate-x-0 animate-slide-in-left" : "-translate-x-full"
          }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <span className="text-xl font-bold text-foreground">ReShop</span>
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="rounded-full p-2 hover:bg-accent hover:text-foreground transition-colors animate-smooth"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Info (Mobile) */}
          {authUser ? (
            <button
              onClick={() => {
                dispatch(toggleSidebar());
                setTimeout(() => {
                  dispatch(toggleProfilePanel());
                }, 300);
              }}
              className="border-b border-border p-4 block hover:bg-accent/50 transition-colors w-full text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary overflow-hidden">
                  {authUser.avatar?.url ? (
                    <img src={authUser.avatar.url} alt={authUser.name} className="h-full w-full object-cover" />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <div>
                  <p className="font-semibold">{authUser.name}</p>
                  <p className="text-xs text-muted-foreground">{authUser.email}</p>
                </div>
              </div>
            </button>
          ) : (
            <div className="border-b border-border p-4">
              <button
                onClick={() => {
                  dispatch(toggleSidebar());
                  dispatch(toggleAuthPopup());
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <User size={18} />
                Login / Register
              </button>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={handleLinkClick}
                      className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 border-t border-border pt-4">
              <h3 className="px-4 text-sm font-semibold text-muted-foreground mb-2">Filters</h3>
              <CategoriesSidebar />
            </div>
          </nav>

          {/* Footer */}
          {authUser && (
            <div className="border-t border-border p-4">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut size={20} />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
