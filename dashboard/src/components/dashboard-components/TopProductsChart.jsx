import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useSelector } from 'react-redux';

const TopProductsChart = () => {
  const { topSellingProducts } = useSelector((state) => state.dashboard);

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  const data = topSellingProducts.map((product) => ({
    name: product.name.length > 15 ? product.name.substring(0, 15) + '...' : product.name,
    value: parseInt(product.total_sold),
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-2 border border-blue-100 dark:border-gray-700 rounded shadow-md">
          <p className="text-xs font-semibold text-gray-900 dark:text-white">{payload[0].name}</p>
          <p className="text-xs text-blue-600 dark:text-blue-400">Sold: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Top Products Share</h3>

      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopProductsChart;
