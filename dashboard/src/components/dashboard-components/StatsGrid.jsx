import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, ShoppingCart } from 'lucide-react';
import { useSelector } from 'react-redux';

const StatCard = ({ title, value, trend, trendUp, icon: Icon, color }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${color}`}>
                    <Icon size={22} className="text-white" />
                </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
                <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trendUp
                        ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                    {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {trend}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">vs last period</span>
            </div>
        </div>
    );
};

const StatsGrid = () => {
    const {
        totalRevenueAllTime,
        totalUsersCount,
        recentOrders,
        revenueGrowth,
        newUsersThisMonth
    } = useSelector((state) => state.dashboard);

    // Calculate generic stats (in a real app these would be pre-calculated in backend or selector)
    const totalOrders = recentOrders ? recentOrders.length : 0;

    // Helper formatters
    const formatCurrency = (val) => `$${parseFloat(val).toLocaleString()}`;

    const stats = [
        {
            title: "Total Revenue",
            value: formatCurrency(totalRevenueAllTime),
            trend: revenueGrowth || "+0%",
            trendUp: !revenueGrowth?.includes('-'),
            icon: DollarSign,
            color: "bg-gradient-to-br from-blue-500 to-blue-600"
        },
        {
            title: "Total Orders",
            value: totalOrders.toLocaleString(), // This is just recent orders, ideally backend sends total count
            trend: "+12.5%",
            trendUp: true,
            icon: ShoppingCart,
            color: "bg-gradient-to-br from-purple-500 to-purple-600"
        },
        {
            title: "Total Customers",
            value: totalUsersCount.toLocaleString(),
            trend: `+${newUsersThisMonth}`,
            trendUp: true,
            icon: Users,
            color: "bg-gradient-to-br from-emerald-500 to-emerald-600"
        },
        {
            title: "Avg. Order Value",
            value: "$120.50", // Placeholder until backend provides
            trend: "+2.4%",
            trendUp: true,
            icon: ShoppingBag,
            color: "bg-gradient-to-br from-orange-500 to-orange-600"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    );
};

export default StatsGrid;
