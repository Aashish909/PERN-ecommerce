import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../store/slices/orderSlice";
import { Package, Clock, CheckCircle, XCircle, Loader, ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import AccountSidebar from "../components/Account/AccountSidebar";

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-600";
      case "Processing":
        return "bg-blue-100 text-blue-600";
      case "Shipped":
        return "bg-purple-100 text-purple-600";
      case "Cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const filterStatuses = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

  const filteredOrders = statusFilter === "All"
    ? orders
    : orders.filter(order => order.order_status === statusFilter);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-48 lg:pt-52 pb-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <AccountSidebar />

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <Package className="text-primary" size={28} />
              <h1 className="text-2xl font-bold">My Orders</h1>
            </div>

            {/* Filter Tabs */}
            <div className="mb-6 overflow-x-auto">
              <div className="flex gap-2 min-w-max pb-2">
                {filterStatuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${statusFilter === status
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-card border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                  >
                    {status}
                    {status !== "All" && (
                      <span className="ml-2 text-xs opacity-70">
                        ({orders.filter(o => o.order_status === status).length})
                      </span>
                    )}
                    {status === "All" && (
                      <span className="ml-2 text-xs opacity-70">
                        ({orders.length})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center bg-card">
                <Package size={64} className="mb-4 text-muted-foreground/20" />
                <h2 className="mb-2 text-xl font-semibold">
                  {statusFilter === "All" ? "No orders yet" : `No ${statusFilter.toLowerCase()} orders`}
                </h2>
                <p className="mb-6 text-muted-foreground">
                  {statusFilter === "All"
                    ? "You haven't placed any orders yet. Start shopping now!"
                    : `You don't have any ${statusFilter.toLowerCase()} orders at the moment.`
                  }
                </p>
                {statusFilter === "All" && (
                  <Link
                    to="/products"
                    className="rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Browse Products
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="group flex flex-col md:flex-row items-center justify-between gap-6 rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md hover:border-primary/20"
                  >
                    {/* Order Info & Product Preview */}
                    <div className="flex items-center gap-6 flex-1 w-full md:w-auto">
                      {/* Product Images Preview (Stacked) */}
                      <div className="flex -space-x-3 flex-shrink-0">
                        {order.order_items?.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="h-12 w-12 rounded-md border-2 border-card overflow-hidden bg-muted relative z-10">
                            <img
                              src={item.image || "https://placehold.co/100"}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ))}
                        {order.order_items?.length > 3 && (
                          <div className="h-12 w-12 rounded-full border-2 border-card bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground relative z-0">
                            +{order.order_items.length - 3}
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {order.order_items?.[0]?.title}
                          {order.order_items?.length > 1 && <span className="text-muted-foreground font-normal"> + {order.order_items.length - 1} more</span>}
                        </h3>
                        <p className="text-sm text-muted-foreground">Order #{order.id.slice(0, 8)}</p>
                      </div>
                    </div>

                    {/* Status, Date, Total */}
                    <div className="flex items-center justify-between w-full md:w-auto gap-8 md:gap-12">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                        {order.order_status}
                      </span>

                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>

                      <div className="text-right w-20">
                        <p className="font-bold">${order.total_price}</p>
                      </div>

                      <button className="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-primary transition-colors">
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
