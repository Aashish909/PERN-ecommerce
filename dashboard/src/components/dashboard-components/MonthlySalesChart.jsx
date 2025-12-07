import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';

const MonthlySalesChart = () => {
  const { monthlySales } = useSelector((state) => state.dashboard);

  // Transform the data for the chart
  const chartData = monthlySales.map((item) => ({
    month: item.month,
    sales: parseFloat(item.totalsales) || 0,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-100 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-gray-900 dark:text-white font-semibold mb-1">{label}</p>
          <p className="text-blue-600 dark:text-blue-400 font-medium">
            Sales: ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Overview</h3>
        <select className="bg-gray-50 dark:bg-gray-700 border-none text-sm text-gray-500 dark:text-gray-300 rounded-lg px-3 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors focus:ring-0">
          <option>Last 12 Months</option>
          <option>Last 6 Months</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="opacity-50 dark:opacity-20" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorSales)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlySalesChart;
