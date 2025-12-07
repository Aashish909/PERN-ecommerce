import React from 'react';
import { Link } from 'react-router-dom';
import { Shirt, Smartphone, Book, Trophy, Gamepad, Monitor, Watch, ShoppingBag, Gem, Glasses, Footprints } from 'lucide-react';

const FullScreenMenu = () => {
    return (
        <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-h-[400px]">
            <div className="container mx-auto px-4 py-8">
                <div className="flex gap-8">
                    {/* Sidebar-like list on the left */}
                    <div className="w-64 border-r border-gray-100 pr-4 flex-shrink-0">
                        <h3 className="font-bold text-gray-900 mb-4 px-2">Categories</h3>
                        <ul className="space-y-1">
                            {[
                                { name: "Fashion", icon: Shirt },
                                { name: "Electronics", icon: Smartphone },
                                { name: "Books", icon: Book },
                                { name: "Sports and Outdoors", icon: Trophy },
                                { name: "Software", icon: Monitor },
                                { name: "Toys and Games", icon: Gamepad }
                            ].map((cat) => (
                                <li key={cat.name} className="flex items-center gap-3 px-2 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                                    <cat.icon size={16} />
                                    <span>{cat.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-6">Men's Fashion</h3>
                        <div className="grid grid-cols-4 gap-6">
                            {[
                                { name: "T-Shirt", icon: Shirt },
                                { name: "Formal Shirt", icon: Shirt },
                                { name: "Shirt", icon: Shirt },
                                { name: "Shoes", icon: Footprints },
                                { name: "Jeans Pant", icon: Shirt },
                                { name: "Gabardine Pant", icon: Shirt },
                                { name: "Formal Pant", icon: Shirt },
                                { name: "Sunglass", icon: Glasses },
                            ].map((item, idx) => (
                                <Link key={idx} to="#" className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary transition-colors p-2 rounded-lg hover:bg-gray-50">
                                    <item.icon size={18} className="text-gray-400" />
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                        </div>

                        <h3 className="font-bold text-gray-900 mt-8 mb-6">Women's Fashion</h3>
                        <div className="grid grid-cols-4 gap-6">
                            {[
                                { name: "Clothing", icon: Shirt },
                                { name: "Shoes", icon: Footprints },
                                { name: "Jewelry", icon: Gem },
                                { name: "Watches", icon: Watch },
                                { name: "Hand Bags", icon: ShoppingBag },
                                { name: "Accessories", icon: Glasses },
                                { name: "Makeup", icon: Gem },
                                { name: "Clothing", icon: Shirt },
                            ].map((item, idx) => (
                                <Link key={idx} to="#" className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary transition-colors p-2 rounded-lg hover:bg-gray-50">
                                    <item.icon size={18} className="text-gray-400" />
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FullScreenMenu;
