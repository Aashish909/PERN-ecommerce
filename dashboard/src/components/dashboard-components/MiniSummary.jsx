import { BarChart3, TrendingUp } from "lucide-react";
import { useSelector } from "react-redux";

const MiniSummary = () => {
  const {
    currentMonthSales,
    revenueGrowth,
    orderStatusCounts,
    topSellingProducts,
  } = useSelector((state) => state.dashboard);

  // Calculate total orders this month
  const totalOrdersThisMonth = Object.values(orderStatusCounts).reduce((sum, count) => sum + count, 0);

  // Calculate product share based on top products (simplified metric)
  const productShare = topSellingProducts.length > 0
    ? ((topSellingProducts[0]?.total_sold || 0) / (totalOrdersThisMonth || 1) * 100).toFixed(2)
    : "0.00";

  const summaries = [
    {
      title: "Weekly Sales",
      value: `$${(currentMonthSales / 4).toFixed(2)}`,
      change: revenueGrowth || "+0.00%",
      icon: BarChart3,
      color: "text-blue-600"
    },
    {
      title: "Product Share",
      value: `${productShare}%`,
      change: "+10.50%",
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Total Order",
      value: totalOrdersThisMonth.toString(),
      change: revenueGrowth || "+0.00%",
      icon: BarChart3,
      color: "text-green-600"
    },
    {
      title: "Market Share",
      value: `$${currentMonthSales.toFixed(2)}`,
      change: revenueGrowth || "+0.00%",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {summaries.map((item, index) => (
        <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500">{item.title}</p>
            <item.icon className={item.color} size={20} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{item.value}</h3>
          <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
            <TrendingUp size={14} />
            {item.change}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MiniSummary;
