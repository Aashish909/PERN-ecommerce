
import React from 'react';
import { X, User, ShoppingBag, DollarSign, Calendar, MapPin, Mail, Phone, Clock } from 'lucide-react';

const UserDetailsModal = ({ user, onClose }) => {
    if (!user) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header with gradient background */}
                <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Profile Info Section - Overlapping header */}
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="flex items-end gap-4">
                            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
                                {user.avatar?.url ? (
                                    <img
                                        src={user.avatar.url}
                                        alt={user.name}
                                        className="w-full h-full object-cover rounded-xl bg-gray-100"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-blue-50 rounded-xl text-blue-500">
                                        <User size={40} />
                                    </div>
                                )}
                            </div>
                            <div className="pb-1">
                                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                    {user.role || 'Customer'}
                                </span>
                            </div>
                        </div>

                        <div className="text-right pb-1">
                            <p className="text-sm text-gray-500">Joined</p>
                            <p className="font-medium text-gray-900 flex items-center gap-1.5 justify-end">
                                <Calendar size={14} className="text-gray-400" />
                                {new Date(user.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                    <DollarSign size={20} />
                                </div>
                                <p className="text-sm font-medium text-gray-500">Total Spent</p>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                ${parseFloat(user.total_spent || 0).toLocaleString()}
                            </p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                    <ShoppingBag size={20} />
                                </div>
                                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {user.total_orders || 0}
                            </p>
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                                <Mail size={18} className="text-gray-400" />
                                <div className="overflow-hidden">
                                    <p className="text-xs text-gray-500">Email Address</p>
                                    <p className="text-sm font-medium text-gray-900 truncate" title={user.email}>{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-center w-[18px]">
                                    <span className="font-mono text-gray-400 text-xs text-center w-full">ID</span>
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-xs text-gray-500">User ID</p>
                                    <p className="text-sm font-mono text-gray-600 truncate">{user.id}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                            Close
                        </button>
                        <button
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                        >
                            Send Email
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default UserDetailsModal;
