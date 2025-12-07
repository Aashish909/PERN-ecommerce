import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./store/slices/authSlice";
import SideBar from "./components/SideBar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Products from "./components/Products";
import Categories from "./components/Categories";
import Orders from "./components/Orders";
import Users from "./components/Users";
import Profile from "./components/Profile";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProductDetail from "./pages/ProductDetail";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  // ... (loading check)

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* ... login/password routes ... */}
          <Route path="/login" element={<Login />} />
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/password/reset/:token" element={<ResetPassword />} />

          {/* Protected Admin Route */}
          <Route
            path="/*"
            element={
              isAuthenticated && user?.role === "Admin" ? (
                <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 overflow-hidden">
                  {/* Mobile Sidebar Overlay */}
                  {isSidebarOpen && (
                    <div
                      className="fixed inset-0 z-[45] bg-black/50 md:hidden glass"
                      onClick={() => setIsSidebarOpen(false)}
                    />
                  )}

                  <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

                  <div className="flex-1 flex flex-col h-full overflow-hidden">
                    <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                    <div className="flex-1 overflow-y-auto overflow-x-hidden p-0 bg-gray-50 dark:bg-gray-900 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-600">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/:id" element={<ProductDetail />} />
                        <Route path="/categories" element={<Categories />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/customers" element={<Users />} />
                        <Route path="/profile" element={<Profile />} />
                        {/* Placeholder routes for other menu items */}
                        <Route path="/brands" element={<PlaceholderPage title="Brands" />} />
                        <Route path="/refunds" element={<PlaceholderPage title="Refunds" />} />
                        <Route path="/sellers" element={<PlaceholderPage title="Sellers" />} />
                        <Route path="/earnings" element={<PlaceholderPage title="Earnings" />} />
                        <Route path="/refund-request" element={<PlaceholderPage title="Refund Requests" />} />
                        <Route path="/reviews" element={<PlaceholderPage title="Reviews" />} />
                        <Route path="/shop-setting" element={<PlaceholderPage title="Shop Settings" />} />
                        <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
                      </Routes>
                    </div>
                  </div>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          limit={1}
          style={{ zIndex: 99999 }}
        />
      </Router>
    </ThemeProvider>
  );
}

// Simple placeholder component for unimplemented pages
const PlaceholderPage = ({ title }) => (
  <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-700 m-8 rounded-xl h-[calc(100vh-10rem)]">
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">{title}</h2>
      <p className="text-gray-600 dark:text-gray-400">This page is under construction</p>
    </div>
  </div>
);

export default App;
