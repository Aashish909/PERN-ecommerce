import { useSelector } from "react-redux";

const TopSellingProducts = () => {
  const { recentOrders, stockOutProducts } = useSelector((state) => state.dashboard);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Purchases */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Purchases</h3>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium transition-colors">View All</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 pb-3 uppercase tracking-wider">Order ID</th>
                <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 pb-3 uppercase tracking-wider">Product</th>
                <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 pb-3 uppercase tracking-wider">Status</th>
                <th className="text-right text-xs font-semibold text-gray-500 dark:text-gray-400 pb-3 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {recentOrders && recentOrders.length > 0 ? (
                recentOrders.map((order, index) => (
                  <tr key={index} className="group hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="py-3 text-sm font-medium text-gray-900 dark:text-white">#{order.id}</td>
                    <td className="py-3 text-sm text-gray-600 dark:text-gray-300 max-w-[150px] truncate">{order.product_name || "Multiple Items"}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${order.payment_status === 'Paid' || order.payment_status === 'paid'
                        ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30'
                        : 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30'
                        }`}>
                        {order.payment_status || 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-900 dark:text-white text-right font-medium">
                      ${parseFloat(order.total_price).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500 dark:text-gray-400">
                    No recent orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Out Products */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Stock Alerts</h3>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium transition-colors">Manage Stock</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 pb-3 uppercase tracking-wider">Product</th>
                <th className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 pb-3 uppercase tracking-wider">Stock</th>
                <th className="text-right text-xs font-semibold text-gray-500 dark:text-gray-400 pb-3 uppercase tracking-wider">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {stockOutProducts && stockOutProducts.length > 0 ? (
                stockOutProducts.map((product, index) => (
                  <tr key={index} className="group hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="py-3 text-sm font-medium text-gray-900 dark:text-white max-w-[180px] truncate">{product.name}</td>
                    <td className="py-3 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30">
                        {product.stock || '0'} Left
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-900 dark:text-white text-right font-medium">
                      ${parseFloat(product.price).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-8 text-center text-gray-500 dark:text-gray-400">
                    No stock alerts. Great job! 🎉
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TopSellingProducts;
