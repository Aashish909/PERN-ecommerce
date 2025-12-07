import React from "react";
import { X, Package, MapPin, CreditCard, Calendar, User, Mail, Phone, Truck, CheckCircle, Clock, XCircle, DollarSign, ShieldCheck } from "lucide-react";

const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    const { shipping_info, order_items } = order;

    // Logic: If payment is Online, we treat it as paid if the backend says so. 
    // Usually "Online" means Stripe/etc succeeded.
    const isOnline = order.payment_type === 'Online';
    // If online, usually paid immediately. If COD, pending until paid_at is set.
    // We'll trust the order.paid_at logic from backend primarily, but we can visually emphasize "Online" means secure.

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Processing':
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200"><Clock size={14} /> Processing</span>;
            case 'Shipped':
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"><Truck size={14} /> Shipped</span>;
            case 'Delivered':
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200"><CheckCircle size={14} /> Delivered</span>;
            case 'Cancelled':
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200"><XCircle size={14} /> Cancelled</span>;
            default:
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">{status}</span>;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-gray-200">

                {/* Header */}
                <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-5">
                        <div className="bg-blue-50 p-3 rounded-xl">
                            <Package className="text-blue-600" size={28} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold text-gray-900">Order #{order.id.slice(0, 8)}</h2>
                                {getStatusBadge(order.order_status)}
                            </div>
                            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                <Calendar size={14} />
                                Placed on {new Date(order.created_at).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Left Column - Order Items (2 cols wide) */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Products Card */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                        <Package size={18} className="text-gray-500" />
                                        Order Items <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{order_items.length}</span>
                                    </h3>
                                </div>
                                <div className="divide-y divide-gray-50">
                                    {order_items.map((item, index) => (
                                        <div key={index} className="p-6 flex items-start gap-5 hover:bg-gray-50/50 transition-colors">
                                            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <Package size={24} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 text-lg mb-1 leading-tight">{item.title}</h4>
                                                <p className="text-sm text-gray-500 mb-2">Product ID: <span className="font-mono text-xs text-gray-400">{item.product_id}</span></p>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">Qty: {item.quantity}</span>
                                                    <span>×</span>
                                                    <span>${parseFloat(item.price).toFixed(2)}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900 text-lg">
                                                    ${(item.quantity * parseFloat(item.price)).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Totals Section */}
                                <div className="bg-gray-50 p-6 border-t border-gray-100 space-y-3">
                                    <div className="flex justify-between text-gray-600 text-sm">
                                        <span>Subtotal</span>
                                        <span>${parseFloat(order.total_price).toFixed(2)}</span>
                                        {/* Simplified calculation for demo, normally would subtract others */}
                                    </div>
                                    <div className="flex justify-between text-gray-600 text-sm">
                                        <span>Tax</span>
                                        <span>Included</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 text-sm">
                                        <span>Shipping</span>
                                        <span>Included</span>
                                    </div>
                                    <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                                        <span className="font-bold text-gray-900 text-lg">Total Amount</span>
                                        <span className="font-bold text-blue-600 text-2xl">${parseFloat(order.total_price).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Details (1 col wide) */}
                        <div className="space-y-6">

                            {/* Customer Details */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-white">
                                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                        <User size={18} className="text-gray-500" />
                                        Customer
                                    </h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex items-center gap-4 border-b border-gray-50 pb-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                                            {shipping_info?.full_name?.charAt(0) || "U"}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{shipping_info?.full_name || "Unknown User"}</p>
                                            <p className="text-xs text-gray-500">ID: {order.buyer_id?.slice(0, 8)}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium uppercase mb-1">Contact Info</p>
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <Phone size={14} className="text-gray-400" />
                                                <span className="font-medium">{shipping_info?.phone || "N/A"}</span>
                                            </div>
                                            {/* Could add email here if fetched */}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Details */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-white">
                                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                        <MapPin size={18} className="text-gray-500" />
                                        Shipping Details
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="relative pl-4 border-l-2 border-gray-100 py-1">
                                        <p className="text-gray-900 font-medium leading-relaxed">
                                            {shipping_info?.address}
                                        </p>
                                        <p className="text-gray-600 mt-1">
                                            {shipping_info?.city}, {shipping_info?.state}
                                        </p>
                                        <p className="text-gray-600">
                                            {shipping_info?.country} - <span className="font-mono text-gray-500">{shipping_info?.pincode}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Details */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-white">
                                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                        <CreditCard size={18} className="text-gray-500" />
                                        Payment Info
                                    </h3>
                                </div>
                                <div className="p-6 space-y-5">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 text-sm">Payment Method</span>
                                        <span className="font-medium text-gray-900 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                                            {order.payment_type}
                                        </span>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${order.paid_at || isOnline ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                                {order.paid_at || isOnline ? <ShieldCheck size={18} /> : <DollarSign size={18} />}
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-bold uppercase">Status</p>
                                                <p className={`font-bold ${order.paid_at || isOnline ? 'text-green-700' : 'text-yellow-700'}`}>
                                                    {order.paid_at || isOnline ? 'Paid Securely' : 'Pending Payment'}
                                                </p>
                                            </div>
                                        </div>
                                        {isOnline && (
                                            <span className="text-[10px] bg-white border border-gray-200 px-2 py-1 rounded text-gray-500 font-medium">
                                                ONLINE
                                            </span>
                                        )}
                                    </div>

                                    {order.paid_at && (
                                        <p className="text-xs text-center text-gray-400">
                                            Paid on {new Date(order.paid_at).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                    <p className="text-sm text-gray-400">
                        Order ID: <span className="font-mono">{order.id}</span>
                    </p>
                    <div className="flex gap-3">
                        <button className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-bold transition-all shadow-sm">
                            Print Invoice
                        </button>
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition-all shadow-md shadow-blue-200"
                        >
                            Close Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;
