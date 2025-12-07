import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import StatsGrid from "./dashboard-components/StatsGrid";
import AIInsights from "./dashboard-components/AIInsights";
import MonthlySalesChart from "./dashboard-components/MonthlySalesChart";
import OrdersChart from "./dashboard-components/OrdersChart";
import TopProductsChart from "./dashboard-components/TopProductsChart";
import TopSellingProducts from "./dashboard-components/TopSellingProducts";
import {
  fetchDashboardStats,
  fetchRecentOrders,
  fetchStockOutProducts,
} from "../store/slices/dashboardSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    // Fetch all dashboard data on component mount
    dispatch(fetchDashboardStats());
    dispatch(fetchRecentOrders());
    dispatch(fetchStockOutProducts());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
        {/* Header Removed */}
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
        {/* Header Removed */}
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <p className="text-red-600 text-lg font-semibold">Error loading dashboard</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{error}</p>
            <button
              onClick={() => {
                dispatch(fetchDashboardStats());
                dispatch(fetchRecentOrders());
                dispatch(fetchStockOutProducts());
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full transition-colors duration-300">
      {/* Header Removed */}

      <main className="max-w-7xl mx-auto p-6 space-y-6">

        {/* New Stats Grid */}
        <StatsGrid />

        {/* AI Insights Section */}
        <AIInsights />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MonthlySalesChart />
          <TopProductsChart />
        </div>

        {/* Orders Chart */}
        <OrdersChart />

        {/* Top Selling Products */}
        <TopSellingProducts />
      </main>
    </div>
  );
};

export default Dashboard;
