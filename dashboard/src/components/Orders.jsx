import React, { useEffect, useState } from "react";
import { LoaderCircle, Package, Search, TruckIcon, Eye, CheckCircle, XCircle, Clock, Download } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { DollarSign, Users as UsersIcon, ShoppingBag, CreditCard } from "lucide-react";

import api from "../lib/api";
import { toast } from "react-toastify";

import OrderDetailsModal from "../modals/OrderDetailsModal";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalCustomers: 0,
    totalTransactions: 0,
    totalProducts: 0,
    statusCounts: { Processing: 0, Shipped: 0, Delivered: 0, Cancelled: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrdersData = async () => {
    try {
      setLoading(true);
      const [ordersRes, statsRes] = await Promise.all([
        api.get("/order/admin/getall"),
        api.get("/order/admin/stats")
      ]);

      setOrders(ordersRes.data.orders || []);
      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load orders data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersData();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      console.log(`Updating order ${orderId} to ${newStatus}`);
      await api.put(`/order/admin/update/${orderId}`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrdersData(); // Refresh data
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id?.toString().includes(searchQuery) ||
      order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shipping_info?.city?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === "all" || order.order_status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentBadge = (type, status) => {
    // FORCE "Paid" for Online orders as per business rule
    const displayStatus = type === 'Online' ? 'Paid' : status;
    const isPaid = displayStatus === 'Paid';

    return (
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">{type}</span>
        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full w-fit ${isPaid ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
          }`}>
          {displayStatus}
        </span>
      </div>
    );
  };

  const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={20} className="opacity-80" />
      </div>
    </div>
  );

  return (
    <div className="flex-1 w-full bg-gray-50/50 min-h-screen">

      <main className="p-8 max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-500 mt-1">Manage and track all customer orders</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Download size={16} />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
              <CheckCircle size={16} />
              Mark All Read
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            color="bg-green-100 text-green-600"
          />
          <StatCard
            title="Total Customers"
            value={stats.totalCustomers}
            icon={UsersIcon}
            color="bg-purple-100 text-purple-600"
          />
          <StatCard
            title="Total Transactions"
            value={stats.totalTransactions}
            icon={ShoppingBag}
            color="bg-blue-100 text-blue-600"
          />
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={Package}
            color="bg-orange-100 text-orange-600"
          />
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center bg-white">
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              {['all', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${filterStatus === status
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  {status === 'all' ? 'All Orders' : status}
                  <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${filterStatus === status ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                    {status === 'all'
                      ? orders.length
                      : stats.statusCounts[status] || 0}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <LoaderCircle className="animate-spin text-blue-600 mb-4" size={40} />
              <p className="text-gray-500">Loading orders...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-600">Order ID</th>
                    <th className="px-6 py-4 font-semibold text-gray-600">Date</th>
                    <th className="px-6 py-4 font-semibold text-gray-600">Customer</th>
                    <th className="px-6 py-4 font-semibold text-gray-600">Categories</th>
                    <th className="px-6 py-4 font-semibold text-gray-600">Payment</th>
                    <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-4 font-semibold text-gray-600">City</th>
                    <th className="px-6 py-4 font-semibold text-gray-600 text-right">Total</th>
                    <th className="px-4 py-4 font-semibold text-gray-600"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <td className="px-6 py-4">
                          <span className="font-mono font-medium text-blue-600 block mb-1">#{order.id.slice(0, 8)}...</span>
                          <span className="text-sm font-semibold text-gray-800 truncate max-w-[200px] block" title={order.order_items?.[0]?.title}>
                            {order.order_items?.[0]?.title || 'Product'}
                            {order.order_items?.length > 1 && <span className="text-gray-500 font-normal ml-1">+{order.order_items.length - 1} more</span>}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
                              {order.customer_name?.slice(0, 2) || 'UN'}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{order.customer_name || 'Unknown'}</p>
                              <p className="text-xs text-gray-500">#{order.buyer_id.slice(0, 6)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {order.categories && order.categories.slice(0, 2).map((cat, i) => (
                              <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs border border-gray-200">
                                {cat}
                              </span>
                            ))}
                            {order.categories && order.categories.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs border border-gray-200">
                                +{order.categories.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getPaymentBadge(order.payment_type, order.payment_status)}
                        </td>
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={order.order_status}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer focus:ring-2 ring-offset-1 focus:outline-none ${getStatusColor(order.order_status)}`}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {order.city || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-gray-900">
                          ${parseFloat(order.total_price).toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button
                            className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrder(order);
                            }}
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="px-6 py-24 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Search size={32} className="opacity-50" />
                          </div>
                          <p className="text-lg font-medium text-gray-600">No orders found</p>
                          <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
};

export default Orders;
