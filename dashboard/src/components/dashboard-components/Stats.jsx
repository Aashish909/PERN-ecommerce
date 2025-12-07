import { TrendingUp, TrendingDown, ShoppingBag, DollarSign, Package, TruckIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { formatNumber } from "../../lib/helper";

const Stats = () => {
  const {
    totalRevenueAllTime,
    todayRevenue,
    yesterdayRevenue,
    orderStatusCounts,
  } = useSelector((state) => state.dashboard);

  // Calculate total orders
  const totalOrders = Object.values(orderStatusCounts).reduce((sum, count) => sum + count, 0);

  // Calculate order change percentage (comparing today vs yesterday - simplified)
  const orderChangePercent = yesterdayRevenue > 0
    ? (((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100).toFixed(2)
    : todayRevenue > 0 ? 100 : 0;
  const orderChangePositive = orderChangePercent >= 0;

  // Calculate sold items (sum of all orders)
  const soldItems = totalOrders;
  const soldItemsChange = "-2.65"; // Placeholder - would need historical data
  const soldItemsPositive = false;

  // Calculate shipping cost (estimate as 10% of revenue)
  const shippingCost = (totalRevenueAllTime * 0.1).toFixed(2);
  const shippingChange = "-13.16"; // Placeholder - would need historical data
  const shippingPositive = false;

  const stats = [
    {
      title: "Total Orders",
      value: formatNumber(totalOrders),
      change: `${orderChangePositive ? '+' : ''}${orderChangePercent}%`,
      isPositive: orderChangePositive,
      subtitle: `Processing: ${orderStatusCounts.Processing || 0}`,
      icon: ShoppingBag,
      color: "bg-blue-500"
    },
    {
      title: "Sold Items",
      value: formatNumber(soldItems),
      change: `${soldItemsChange}%`,
      isPositive: soldItemsPositive,
      subtitle: `Shipped: ${orderStatusCounts.Shipped || 0}`,
      icon: Package,
      color: "bg-purple-500"
    },
    {
      title: "Gross Sale",
      value: `$${formatNumber(totalRevenueAllTime)}`,
      change: `+${((todayRevenue / (totalRevenueAllTime || 1)) * 100).toFixed(2)}%`,
      isPositive: true,
      subtitle: `Today: $${todayRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-green-500"
    },
    {
      title: "Total Shipping Cost",
      value: `$${formatNumber(shippingCost)}`,
      change: `${shippingChange}%`,
      isPositive: shippingPositive,
      subtitle: `Delivered: ${orderStatusCounts.Delivered || 0}`,
      icon: TruckIcon,
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            </div>
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="text-white" size={24} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{stat.subtitle}</span>
            <div className={`flex items-center gap-1 text-sm font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
              {stat.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {stat.change}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stats;
