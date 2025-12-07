import React, { useState, useEffect } from "react";
import { LoaderCircle, Search, Package, ShoppingBag, Sparkles, Plus, Edit, Trash2, X, Upload, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { toast } from "react-toastify";

// Toast Components
const SuccessToast = ({ message }) => (
    <div className="flex items-center gap-3">
        <CheckCircle size={20} />
        <span>{message}</span>
    </div>
);

const ErrorToast = ({ message }) => (
    <div className="flex items-center gap-3">
        <XCircle size={20} />
        <span>{message}</span>
    </div>
);

const Categories = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: "" });
    const [iconFile, setIconFile] = useState(null);
    const [iconPreview, setIconPreview] = useState(null);

    // Fetch categories
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await api.get("/category/");
            setCategories(response.data.categories);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error(<ErrorToast message="Failed to load categories" />);
        } finally {
            setLoading(false);
        }
    };

    // Fetch stats
    const fetchStats = async () => {
        try {
            const response = await api.get("/category/stats");
            setStats(response.data.stats);
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchStats();
    }, []);

    const handleIconChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIconFile(file);
            setIconPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = new FormData();
            data.append("name", formData.name);
            if (iconFile) {
                data.append("icon", iconFile);
            }

            if (editingCategory) {
                await api.put(`/category/admin/update/${editingCategory.id}`, data, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success(<SuccessToast message="Category updated successfully!" />);
            } else {
                await api.post("/category/admin/create", data, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success(<SuccessToast message="Category created successfully!" />);
            }

            setShowModal(false);
            setFormData({ name: "" });
            setIconFile(null);
            setIconPreview(null);
            setEditingCategory(null);
            fetchCategories();
            fetchStats();
        } catch (error) {
            console.error("Error saving category:", error);
            toast.error(<ErrorToast message={error.response?.data?.message || "Failed to save category"} />);
        }
    };

    const handleDelete = (category) => {
        const ConfirmToast = ({ closeToast }) => (
            <div>
                <p className="mb-3 font-medium">Delete "{category.name}" category?</p>
                <div className="flex gap-2">
                    <button
                        onClick={async () => {
                            try {
                                await api.delete(`/category/admin/delete/${category.id}`);
                                toast.success(<SuccessToast message="Category deleted!" />);
                                fetchCategories();
                                fetchStats();
                            } catch (error) {
                                toast.error(<ErrorToast message={error.response?.data?.message || "Failed to delete"} />);
                            }
                            closeToast();
                        }}
                        className="flex-1 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors font-medium"
                    >
                        Delete
                    </button>
                    <button
                        onClick={closeToast}
                        className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-medium"
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

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({ name: category.name });
        // Handle icon preview from existing data
        // The backend returns `icon` as a JSON object { url, public_id }
        // or sometimes it might be just a URL string if seeded differently?
        // Based on controller, it's JSON. Based on seed, it's JSON.
        // But let's handle both just in case or check the data structure.
        // The seed script inserts JSON stringified: `JSON.stringify({ url: ... })`.
        // The controller returns `icon` as is from DB (JSONB).
        // So `category.icon` should be an object.
        const iconUrl = category.icon?.url || category.image; // Fallback to image field if it exists from previous attempts
        setIconPreview(iconUrl);
        setShowModal(true);
    };

    const handleCategoryClick = (categoryName) => {
        navigate(`/products?category=${encodeURIComponent(categoryName)}`);
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex-1 w-full bg-gray-50">

            <div className="p-6 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
                        <p className="text-sm text-gray-500">Manage product categories</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingCategory(null);
                            setFormData({ name: "" });
                            setIconFile(null);
                            setIconPreview(null);
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        Add Category
                    </button>
                </div>

                {/* Stats Overview */}
                {stats && (
                    <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">Overview</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 rounded-lg p-3">
                                    <Package className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Categories</p>
                                    <p className="text-2xl font-bold text-gray-800">{stats.totalCategories}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 rounded-lg p-3">
                                    <ShoppingBag className="text-green-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Products</p>
                                    <p className="text-2xl font-bold text-gray-800">{stats.totalProducts}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-purple-100 rounded-lg p-3">
                                    <Sparkles className="text-purple-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Largest Category</p>
                                    <p className="text-lg font-bold text-gray-800">{stats.largestCategory}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Categories Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <LoaderCircle className="animate-spin text-blue-600" size={32} />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Categories
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Products
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredCategories.length > 0 ? (
                                        filteredCategories.map((category) => {
                                            const iconUrl = category.icon?.url || category.image || "https://placehold.co/100x100?text=No+Image";
                                            return (
                                                <tr
                                                    key={category.id}
                                                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                                                    onClick={() => handleCategoryClick(category.name)}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                                                                <img
                                                                    src={iconUrl}
                                                                    alt={category.name}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = "https://placehold.co/100x100?text=No+Image";
                                                                    }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold text-gray-800 text-lg">{category.name}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                                                            {category.product_count || 0}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                            <button
                                                                onClick={() => handleEdit(category)}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="Edit"
                                                            >
                                                                <Edit size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(category)}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Delete"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-12 text-center">
                                                <Package className="mx-auto text-gray-300 mb-3" size={48} />
                                                <p className="text-gray-500">No categories found</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">
                                {editingCategory ? "Edit Category" : "Add New Category"}
                            </h3>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter category name"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category Image
                                    </label>
                                    {iconPreview && (
                                        <div className="mb-3 relative inline-block">
                                            <img
                                                src={iconPreview}
                                                alt="Preview"
                                                className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIconFile(null);
                                                    setIconPreview(null);
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                                        <Upload className="text-gray-400 mb-2" size={24} />
                                        <span className="text-sm text-gray-500">
                                            {iconFile ? `Selected: ${iconFile.name}` : "Click to upload image"}
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleIconChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                <div className="flex items-center gap-3 justify-end mt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            setFormData({ name: "" });
                                            setIconFile(null);
                                            setIconPreview(null);
                                            setEditingCategory(null);
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                                    >
                                        {editingCategory ? "Update" : "Create"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;
