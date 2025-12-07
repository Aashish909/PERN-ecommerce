import React, { useEffect, useState } from "react";
import { LoaderCircle, Search, Trash2, User as UserIcon, Eye, Filter, Download, Plus, MoreHorizontal, ArrowUpRight, ArrowDownRight, RefreshCcw } from "lucide-react";
import api from "../lib/api";
import { toast } from "react-toastify";
import UserDetailsModal from "../modals/UserDetailsModal";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'active', 'inactive'
  const [stats, setStats] = useState({
    totalCustomers: 0,
    newCustomers: 0,
    returnCustomerRate: "0%",
    avgOrderRevenue: "0",
    refunds: 0
  });

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/getallusers?page=${page}`);
      setUsers(response.data.users || []);
      setTotalUsers(response.data.totalUsers || 0);
      setCurrentPage(response.data.currentPage || 1);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/admin/fetch/customer-stats");
      setStats(response.data.stats);
    } catch (error) {
      console.error("Error fetching customer stats:", error);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
    fetchStats();
  }, [currentPage]);

  const handleDelete = async (userId) => {
    const ConfirmToast = ({ closeToast }) => (
      <div>
        <p className="mb-3 font-medium">Delete this customer?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                await api.delete(`/admin/delete/${userId}`);
                toast.success("Customer deleted");
                fetchUsers(currentPage);
              } catch (error) {
                console.error("Error deleting user:", error);
                toast.error("Failed to delete user");
              }
              closeToast();
            }}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
          >
            Delete
          </button>
          <button
            onClick={closeToast}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    );

    toast.warn(<ConfirmToast />, {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      closeButton: true,
    });
  };

  const isActiveUser = (lastOrderDate) => {
    if (!lastOrderDate) return false;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(lastOrderDate) > thirtyDaysAgo;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'all') return matchesSearch;

    const isActive = isActiveUser(user.last_order_date);
    if (activeTab === 'active') return matchesSearch && isActive;
    if (activeTab === 'inactive') return matchesSearch && !isActive; // "Inactive" = No order in 30 days
    return matchesSearch;
  });

  const totalPages = Math.ceil(totalUsers / 10);

  // Components for the Design
  const StatCard = ({ title, value, trend, trendUp }) => (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-md transition-shadow">
      <div>
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1 flex items-center gap-2">
          {title}
        </p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
      </div>
      <div className="flex items-center gap-2 mt-2">
        {trend && (
          <span className={`flex items-center text-xs font-semibold ${trendUp ? 'text-green-600' : 'text-red-500'} bg-opacity-10 px-1.5 py-0.5 rounded`}>
            {trendUp ? <ArrowUpRight size={14} className="mr-0.5" /> : <ArrowDownRight size={14} className="mr-0.5" />}
            {trend}
          </span>
        )}
        {/* Simple sparkline visual */}
        <div className="absolute right-4 bottom-4 opacity-20 group-hover:opacity-40 transition-opacity">
          <RefreshCcw size={40} className="text-blue-500" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 w-full bg-gray-50/50 min-h-screen font-sans">

      <div className="p-8 max-w-[1600px] mx-auto space-y-6">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Customers</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors">
            <Plus size={16} />
            Create Customer
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StatCard title="Total Customer" value={totalUsers.toLocaleString()} trend="12.5%" trendUp={true} />
          <StatCard title="New Customer" value="45" trend="8.2%" trendUp={true} />
          <StatCard title="Return Customer Rate" value="3.45%" trend="1.2%" trendUp={false} />
          <StatCard title="Avg. Order Revenue" value="$425.50" trend="5.4%" trendUp={true} />
          <StatCard title="Refunds" value="3" trend="2.1%" trendUp={false} />
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col gap-4">
          {/* Tabs */}
          <div className="flex items-center border-b border-gray-200">
            {['all', 'active', 'inactive'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${activeTab === tab
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {tab === 'all' ? 'All Customers' : tab}
                {activeTab === tab && <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">{filteredUsers.length}</span>}
              </button>
            ))}
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-[300px]">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
                />
              </div>
              <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50 shadow-sm">
                <Filter size={16} />
                Date range
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50 shadow-sm">
                <Filter size={16} />
                Order value
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50 shadow-sm">
                Manage Table
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <LoaderCircle className="animate-spin text-blue-600 mb-4" size={32} />
              <p className="text-gray-500 text-sm font-medium">Loading customers...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-600">Customer ID</th>
                    <th className="px-6 py-4 font-semibold text-gray-600">Name</th>
                    <th className="px-6 py-4 font-semibold text-gray-600 text-center">No. of Order</th>
                    <th className="px-6 py-4 font-semibold text-gray-600 text-right">Total Order</th>
                    <th className="px-6 py-4 font-semibold text-gray-600 text-right">Avg. Order Value</th>
                    <th className="px-6 py-4 font-semibold text-gray-600 text-center">Status</th>
                    <th className="px-6 py-4 font-semibold text-gray-600">Last Order</th>
                    <th className="px-4 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => {
                      const totalOrders = parseInt(user.total_orders || 0);
                      const totalSpent = parseFloat(user.total_spent || 0);
                      const avgOrderValue = totalOrders > 0 ? (totalSpent / totalOrders) : 0;
                      const active = isActiveUser(user.last_order_date);

                      return (
                        <tr
                          key={user.id}
                          className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                          onClick={() => setSelectedUser(user)}
                        >
                          <td className="px-6 py-4 font-mono text-gray-500 text-xs font-medium">
                            #{user.id.slice(0, 6)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {user.avatar?.url ? (
                                <img src={user.avatar.url} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-blue-600 border border-blue-100">
                                  <UserIcon size={14} />
                                </div>
                              )}
                              <span className="font-semibold text-gray-900">{user.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center font-medium text-gray-900">
                            {totalOrders}
                          </td>
                          <td className="px-6 py-4 text-right font-medium text-gray-900">
                            ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-4 text-right font-medium text-gray-900">
                            ${avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${active
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                              }`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-600' : 'bg-red-600'}`}></div>
                              {active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-500 font-medium">
                            {user.last_order_date ? new Date(user.last_order_date).toLocaleDateString() : 'Never'}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(user.id);
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-24 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <Search size={48} className="mb-4 opacity-20" />
                          <p className="text-lg font-medium text-gray-900">No customers found</p>
                          <p className="text-sm text-gray-500">Try adjusting your filters or search query</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination - Styled to match */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-900">{filteredUsers.length}</span> of <span className="font-semibold text-gray-900">{totalUsers}</span> customers
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-700 shadow-sm"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-700 shadow-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      <UserDetailsModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
};

export default Users;
