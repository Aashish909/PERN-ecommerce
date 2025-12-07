import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';

const OrdersChart = () => {
  const { orderStatusCounts } = useSelector((state) => state.dashboard);

  // Transform object to array format for Recharts
  const data = Object.keys(orderStatusCounts).map((status) => ({
    name: status,
    count: orderStatusCounts[status],
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-100 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-gray-900 dark:text-white font-semibold mb-1">{label}</p>
          <p className="text-blue-600 dark:text-blue-400 font-medium">
            Orders: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Order Status Distribution</h3>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" className="opacity-50 dark:opacity-20" />
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 13, fill: '#6b7280' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              fill="#8b5cf6"
              radius={[0, 4, 4, 0]}
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrdersChart;
