import { Menu, User, ShoppingCart, Sun, Moon, Search, LogOut, LayoutGrid, FileText, UserCircle, Store, ArrowRight, Phone, Mail, ChevronDown, Facebook, Twitter, Instagram, Youtube, Shirt, Smartphone, Car, Bike, Home, Gift, Music, Heart, Dog, Baby, ShoppingBasket, Sparkles } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { toggleAuthPopup, toggleSidebar, toggleCart, toggleSearchBar, toggleProfilePanel } from "../../store/slices/popupSlice";
// import { categories } from "../../data/products"; // Removed as we fetch dynamically
import { logout } from "../../store/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import NavbarDropdown from "./NavbarDropdown";
import MegaMenu from "./MegaMenu";
import FullScreenMenu from "./FullScreenMenu";
import { useState, useRef, useEffect } from "react";
import LocationSelector from "./LocationSelector";
import axios from "axios";

const categoryIcons = {
  "Fashion": Shirt,
  "Electronics": Smartphone,
  "Bikes": Bike,
  "Home & Garden": Home,
  "Gifts": Gift,
  "Music": Music,
  "Health & Beauty": Heart,
  "Pets": Dog,
  "Baby Toys": Baby,
  "Groceries": ShoppingBasket,
  "Automotive": Car,
};

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authUser } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const [searchQuery, setSearchQuery] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("search") || "";
  });
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryDropdownRef = useRef(null);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/product/categories");
        if (response.data.success) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Sync search query with URL changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("search");
    if (query) {
      setSearchQuery(query);
    }
  }, [window.location.search]);

  // Auto-hide navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        // Always show navbar at top of page
        setShowNavbar(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down - hide navbar
        setShowNavbar(false);
      } else {
        // Scrolling up - show navbar
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Close categories dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setCategoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  let cartItemsCount = 0;
  if (cart) {
    cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  }

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleProfileClick = () => {
    if (authUser) {
      dispatch(toggleProfilePanel());
    } else {
      dispatch(toggleAuthPopup());
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      // Do not clear search query so user can see what they searched
    }
  };

  return (
    <div className={`w-full flex flex-col fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}>
      {/* 1. Top Bar */}
      <div className="w-full bg-[#0f172a] text-white py-2 text-xs border-b border-white/10">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="bg-red-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">HOT</span>
              <span>Free Express Shipping</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="cursor-pointer hover:text-primary transition-colors">EN</span>
              <span className="cursor-pointer hover:text-primary transition-colors">USD</span>
            </div>
            <div className="h-3 w-[1px] bg-white/20"></div>
            <div className="flex items-center gap-3">
              <Facebook size={14} className="cursor-pointer hover:text-primary transition-colors" />
              <Twitter size={14} className="cursor-pointer hover:text-primary transition-colors" />
              <Instagram size={14} className="cursor-pointer hover:text-primary transition-colors" />
              <Youtube size={14} className="cursor-pointer hover:text-primary transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Header */}
      <div className="w-full bg-background border-b border-border py-4 relative hidden lg:block">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="relative h-10 w-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-lg" />
              <div className="relative h-9 w-9 rounded-lg border-2 border-primary flex items-center justify-center">
                <Store size={20} className="text-primary" />
              </div>
            </div>
            <span className="text-2xl font-bold text-foreground tracking-tight">ReShop</span>
          </Link>

          {/* Location Selector */}
          <LocationSelector />

          {/* Nav Links (Center) */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Home Menu */}
            <div className="group">
              <Link to="/" className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors py-4">
                Home <ChevronDown size={14} />
              </Link>
              <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-6">
                <div className="container mx-auto px-4">
                  <div className="grid grid-cols-4 gap-4">
                    {categories.map((category) => (
                      <Link key={category} to={`/products?category=${encodeURIComponent(category)}`} className="block p-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors rounded-lg">
                        {category}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mega Menu */}
            <div className="group">
              <button className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors py-4">
                Mega Menu <ChevronDown size={14} />
              </button>
              <MegaMenu />
            </div>

            {/* Full Screen Menu */}
            <div className="group">
              <button className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors py-4">
                Full Screen Menu <ChevronDown size={14} />
              </button>
              <FullScreenMenu />
            </div>

            {/* Pages Menu */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors py-4">
                Pages <ChevronDown size={14} />
              </button>
              <div className="absolute top-full left-0 w-48 bg-white shadow-xl rounded-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-2">
                {["Sale Page", "Vendor", "Shop", "Auth"].map((item) => (
                  <Link key={item} to="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                    {item}
                  </Link>
                ))}
                <a
                  href="https://pern-ai-ecommerce-admin-dashboard.netlify.app/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors border-t border-gray-50 mt-1 pt-2"
                >
                  Admin Dashboard
                </a>
              </div>
            </div>

            {/* User Account Menu */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors py-4">
                User Account <ChevronDown size={14} />
              </button>
              <div className="absolute top-full left-0 w-48 bg-white shadow-xl rounded-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-2">
                <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">Orders</Link>
                <button onClick={() => dispatch(toggleProfilePanel())} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">Profile</button>
                <Link to="/address" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">Address</Link>
                <Link to="/support" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">Support tickets</Link>
                <Link to="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">Wishlist</Link>
              </div>
            </div>

            {/* Vendor Account Menu - Conditional */}
            {authUser?.role === 'vendor' || authUser?.role === 'admin' ? (
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors py-4">
                  Vendor Account <ChevronDown size={14} />
                </button>
                <div className="absolute top-full left-0 w-48 bg-white shadow-xl rounded-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-2">
                  <Link to="/vendor/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">Dashboard</Link>
                  <Link to="/vendor/products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">Products</Link>
                  <Link to="/vendor/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">Orders</Link>
                  <Link to="/vendor/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">Profile</Link>
                </div>
              </div>
            ) : null}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
            >
              {theme === 'dark' ? <Sun size={24} className="text-muted-foreground" /> : <Moon size={24} className="text-muted-foreground" />}
            </button>
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-2 hover:bg-secondary/50 p-1.5 rounded-lg transition-colors"
            >
              {authUser ? (
                authUser.avatar?.url ? (
                  <img src={authUser.avatar.url} alt={authUser.name} className="w-8 h-8 rounded-full object-cover border border-border" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User size={20} />
                  </div>
                )
              ) : (
                <div className="flex items-center gap-2">
                  <UserCircle size={24} className="text-muted-foreground" />
                  <div className="flex flex-col items-start text-xs">
                    <span className="text-muted-foreground leading-none">Hello,</span>
                    <span className="font-semibold leading-none">Sign in</span>
                  </div>
                </div>
              )}
            </button>
            <button
              onClick={() => dispatch(toggleCart())}
              className="p-2 rounded-full hover:bg-secondary transition-colors relative"
            >
              <ShoppingCart size={24} className="text-muted-foreground" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Bottom Navigation */}
      <div className="w-full bg-background border-b border-border hidden lg:block">
        <div className="container mx-auto px-4 flex items-center gap-8 h-14">
          {/* Categories Dropdown Button */}
          <div className="relative" ref={categoryDropdownRef}>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold min-w-[240px] justify-between transition-colors text-gray-700"
              onClick={() => setCategoryOpen(!categoryOpen)}
            >
              <div className="flex items-center gap-2">
                <LayoutGrid size={18} />
                <span>Categories</span>
              </div>
              <ChevronDown size={16} className={`transition-transform ${categoryOpen ? 'rotate-180' : ''}`} />
            </button>
            {/* Categories Dropdown Content */}
            {categoryOpen && (
              <div className="absolute top-full left-0 w-full min-w-[240px] bg-white shadow-xl rounded-b-lg border border-gray-100 z-50 py-2 animate-in fade-in slide-in-from-top-2">
                <div className="flex flex-col">
                  {categories.map((cat) => {
                    const IconComponent = categoryIcons[cat] || LayoutGrid;
                    return (
                      <Link
                        key={cat}
                        to={`/products?category=${encodeURIComponent(cat)}`}
                        className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary flex items-center gap-3 transition-colors"
                        onClick={() => setCategoryOpen(false)}
                      >
                        <span className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-500">
                          <IconComponent size={16} />
                        </span>
                        {cat}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Search Bar (Now here) */}
          <div className="flex-1 max-w-full">
            <form onSubmit={handleSearchSubmit} className="w-full relative flex items-center">
              <div className="absolute left-0 pl-4 flex items-center pointer-events-none">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-32 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary rounded-lg text-sm transition-all outline-none shadow-sm"
                placeholder="Ask AI what you're looking for..."
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-6 bg-[#0f172a] text-white rounded-full text-sm font-semibold hover:bg-[#1e293b] transition-colors flex items-center gap-2"
              >
                <Sparkles size={14} />
                AI Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile Header (Simplified) */}
      <div className="lg:hidden flex flex-col bg-background border-b border-border">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4">
          <button onClick={() => dispatch(toggleSidebar())}>
            <Menu size={24} />
          </button>
          <Link to="/" className="text-xl font-bold">ReShop</Link>
          <div className="flex items-center gap-2">
            <button onClick={() => dispatch(toggleSearchBar())}>
              <Search size={24} />
            </button>
            <button onClick={() => dispatch(toggleCart())} className="relative">
              <ShoppingCart size={24} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Location Selector - Mobile */}
        <div className="px-4 pb-3">
          <LocationSelector />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
