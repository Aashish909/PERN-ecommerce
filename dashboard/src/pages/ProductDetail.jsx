import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, X, Upload, Star, Trash2, Edit2, CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";
import api from "../lib/api";
import { toast } from "react-toastify";

// Custom Toast Components with Icons
const SuccessToast = ({ message }) => (
    <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white/20">
            <CheckCircle size={20} className="text-white" />
        </div>
        <span className="font-medium">{message}</span>
    </div>
);

const ErrorToast = ({ message }) => (
    <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white/20">
            <XCircle size={20} className="text-white" />
        </div>
        <span className="font-medium">{message}</span>
    </div>
);

const WarningToast = ({ message }) => (
    <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white/20">
            <AlertCircle size={20} className="text-white" />
        </div>
        <span className="font-medium">{message}</span>
    </div>
);

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [product, setProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        brand: "",
    });
    const [newImage, setNewImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const categoryOptions = [
        "Electronics",
        "Fashion",
        "Home & Garden",
        "Sports",
        "Books",
        "Beauty",
        "Automotive",
        "Kids &Baby",
    ];

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/product/singleProduct/${id}`);
            const productData = response.data.product;
            setProduct(productData);
            setFormData({
                name: productData.name || "",
                description: productData.description || "",
                price: productData.price || "",
                category: productData.category || "",
                stock: productData.stock || "",
                brand: productData.brand || "",
            });
        } catch (error) {
            console.error("Error fetching product:", error);
            toast.error(<ErrorToast message="Failed to load product" />);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const data = new FormData();

            Object.keys(formData).forEach((key) => {
                data.append(key, formData[key]);
            });

            if (newImage) {
                data.append("images", newImage);
            }

            await api.put(`/product/admin/update/${id}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success(<SuccessToast message="Product updated successfully!" />);
            setEditMode(false);
            setNewImage(null);
            setImagePreview(null);
            fetchProduct();
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error(<ErrorToast message="Failed to update product" />);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = () => {
        const ConfirmToast = ({ closeToast }) => (
            <div>
                <p className="mb-3 font-medium">Delete this product permanently?</p>
                <div className="flex gap-2">
                    <button
                        onClick={async () => {
                            try {
                                await api.delete(`/product/admin/delete/${id}`);
                                toast.success(<SuccessToast message="Product deleted!" />);
                                navigate("/products");
                            } catch (error) {
                                toast.error(<ErrorToast message="Failed to delete product" />);
                            }
                            closeToast();
                        }}
                        className="flex-1 px-4 py-2 bg-white/20 backdrop-blur text-white rounded-lg hover:bg-white/30 transition-colors font-medium"
                    >
                        Delete
                    </button>
                    <button
                        onClick={closeToast}
                        className="flex-1 px-4 py-2 bg-white/10 backdrop-blur text-white rounded-lg hover:bg-white/20 transition-colors font-medium"
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

    if (loading) {
        return (
            <div className="flex-1 overflow-auto bg-gray-50">
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex-1 overflow-auto bg-gray-50">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <p className="text-xl text-gray-600">Product not found</p>
                        <button
                            onClick={() => navigate("/products")}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Back to Products
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Decide which image to show
    const displayImage = imagePreview || product.images?.[0]?.url;

    return (
        <div className="flex-1 overflow-auto bg-gray-50">
            <div className="p-6 max-w-7xl mx-auto">
                {/* Header Actions */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate("/products")}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Products
                    </button>

                    <div className="flex items-center gap-3">
                        {editMode ? (
                            <>
                                <button
                                    onClick={() => {
                                        setEditMode(false);
                                        setNewImage(null);
                                        setImagePreview(null);
                                        setFormData({
                                            name: product.name || "",
                                            description: product.description || "",
                                            price: product.price || "",
                                            category: product.category || "",
                                            stock: product.stock || "",
                                            brand: product.brand || "",
                                        });
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <X size={18} />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    <Save size={18} />
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 size={18} />
                                    Delete
                                </button>
                                <button
                                    onClick={() => setEditMode(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Edit2 size={18} />
                                    Edit Product
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Image */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Image</h3>

                            <div className="space-y-4">
                                {/* Display Image */}
                                {displayImage && (
                                    <div className="relative group">
                                        <img
                                            src={displayImage}
                                            alt="Product"
                                            className={`w-full h-64 object-cover rounded-lg ${imagePreview ? "border-2 border-green-500" : "border border-gray-200"
                                                }`}
                                        />
                                        <span
                                            className={`absolute top-2 left-2 text-white text-xs px-2 py-1 rounded ${imagePreview ? "bg-green-600" : "bg-blue-600"
                                                }`}
                                        >
                                            {imagePreview ? "New Image" : "Current Image"}
                                        </span>
                                        {imagePreview && (
                                            <button
                                                onClick={() => {
                                                    setNewImage(null);
                                                    setImagePreview(null);
                                                }}
                                                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Upload New Image */}
                                {editMode && (
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                                        <Upload className="text-gray-400 mb-2" size={24} />
                                        <span className="text-sm text-gray-500">
                                            {imagePreview ? "Change Image" : "Upload New Image"}
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Product Stats */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistics</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Rating</span>
                                    <div className="flex items-center gap-1">
                                        <Star size={16} className="text-yellow-500 fill-current" />
                                        <span className="font-medium">
                                            {product.ratings ? Number(product.ratings).toFixed(1) : "0.0"}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Reviews</span>
                                    <span className="font-medium">{product.num_of_reviews || 0}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Product ID</span>
                                    <span className="font-mono text-sm">#{product.id}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Created</span>
                                    <span className="text-sm">
                                        {new Date(product.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Product Name
                                    </label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    ) : (
                                        <p className="text-gray-900 font-medium">{product.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    {editMode ? (
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {categoryOptions.map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <p className="text-gray-900">{product.category}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                                    {editMode ? (
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    ) : (
                                        <p className="text-2xl font-bold text-blue-600">${product.price}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                                    {editMode ? (
                                        <input
                                            type="number"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${product.stock > 10
                                                    ? "bg-green-100 text-green-700"
                                                    : product.stock > 0
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {product.stock} units
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={formData.brand}
                                            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter brand name"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{product.brand || "N/A"}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Description</h3>
                            {editMode ? (
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={6}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            ) : (
                                <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
                            )}
                        </div>

                        {/* Reviews Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Reviews</h3>
                            {product.reviews && product.reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {product.reviews.map((review, index) => (
                                        <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={16}
                                                            className={
                                                                i < review.rating
                                                                    ? "text-yellow-500 fill-current"
                                                                    : "text-gray-300"
                                                            }
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-sm text-gray-600">
                                                    by {review.user?.name || "Anonymous"}
                                                </span>
                                            </div>
                                            <p className="text-gray-700">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No reviews yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
