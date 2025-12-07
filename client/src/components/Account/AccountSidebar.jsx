import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    Heart,
    Headphones,
    User,
    MapPin,
    CreditCard,
    LogOut,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";

const AccountSidebar = () => {
    const location = useLocation();
    const dispatch = useDispatch();

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", count: null },
        { icon: Package, label: "Orders", path: "/orders", count: 5 },
        { icon: Heart, label: "Wishlist", path: "/wishlist", count: 19 },
        { icon: Headphones, label: "Support Tickets", path: "/support", count: 1 },
    ];

    const accountSettings = [
        { icon: User, label: "Profile Info", path: "/profile" },
        { icon: MapPin, label: "Addresses", path: "/addresses", count: 16 },
        { icon: CreditCard, label: "Payment Methods", path: "/payment-methods", count: 4 },
    ];

    const isActive = (path) => location.pathname === path;

    const NavItem = ({ item }) => (
        <Link
            to={item.path}
            className={`flex items-center justify-between rounded-lg px-4 py-3 transition-colors ${isActive(item.path)
                    ? "bg-primary/5 text-primary border-l-4 border-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
        >
            <div className="flex items-center gap-3">
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
            </div>
            {item.count !== null && item.count !== undefined && (
                <span className="text-xs font-medium text-muted-foreground">
                    {item.count}
                </span>
            )}
        </Link>
    );

    return (
        <div className="w-full lg:w-80 flex-shrink-0 space-y-8">
            {/* Dashboard Section */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="p-4">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">
                        Dashboard
                    </h3>
                    <div className="space-y-1">
                        {menuItems.map((item) => (
                            <NavItem key={item.label} item={item} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Account Settings Section */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="p-4">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">
                        Account Settings
                    </h3>
                    <div className="space-y-1">
                        {accountSettings.map((item) => (
                            <NavItem key={item.label} item={item} />
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t border-border">
                    <button
                        onClick={() => dispatch(logout())}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-transparent py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountSidebar;
