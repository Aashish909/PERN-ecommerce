import React from 'react';
import { Link } from 'react-router-dom';

const MegaMenu = () => {
    const menuColumns = [
        {
            title: "Home",
            items: ["Market 1", "Market 2", "Gadget 1", "Gadget 2", "Grocery 1", "Grocery 2", "Fashion 1", "Fashion 2"]
        },
        {
            title: "User Account",
            items: ["Order List", "Order Details", "View Profile", "Edit Profile", "Address List", "Add Address", "All tickets", "Ticket details", "Wishlist"]
        },
        {
            title: "Vendor Account",
            items: ["Dashboard", "Profile", "Products", "All products", "Add/Edit product", "Orders", "All orders", "Order details"]
        },
        {
            title: "Sale Page",
            items: ["Sales Version 1", "Sales Version 2", "Shop", "Search product", "Single product", "Cart", "Checkout", "Alternative Checkout", "Order confirmation"]
        }
    ];

    return (
        <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-4 gap-8">
                    {menuColumns.map((column, idx) => (
                        <div key={idx}>
                            <h3 className="font-bold text-gray-900 mb-4">{column.title}</h3>
                            <ul className="space-y-2">
                                {column.items.map((item, itemIdx) => (
                                    <li key={itemIdx}>
                                        <Link to="#" className="text-sm text-gray-600 hover:text-primary transition-colors">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MegaMenu;
