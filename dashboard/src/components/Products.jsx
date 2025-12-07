import React, { useState, useEffect } from "react";
import { LoaderCircle, Plus, Edit, Trash2, Eye, Search, X } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CreateProductModal from "../modals/CreateProductModal";
import UpdateProductModal from "../modals/UpdateProductModal";
import ViewProductModal from "../modals/ViewProductModal";
import { useDispatch, useSelector } from "react-redux";
import api from "../lib/api";
import { toast } from "react-toastify";

const Products = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/product");
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    const ConfirmToast = ({ closeToast }) => (
      <div>
        <p className="mb-3 font-medium">Are you sure you want to delete this product?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                await api.delete(`/product/admin/delete/${productId}`);
                toast.success("Product deleted successfully!");
                fetchProducts();
              } catch (error) {
                console.error("Error deleting product:", error);
                toast.error("Failed to delete product");
              }
              closeToast();
            }}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Delete
          </button>
          <button
            onClick={closeToast}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
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

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowUpdateModal(true);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };


  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !categoryFilter || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const clearCategoryFilter = () => {
    setSearchParams({});
  };

  return (
    <div className="flex-1 w-full bg-gray-50">

      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Products</h2>
            <p className="text-sm text-gray-500">Manage your product inventory</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Active Filters */}
        {categoryFilter && (
          <div className="mb-6 flex items-center gap-2">
            <span className="text-sm text-gray-600">Filtered by:</span>
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              <span className="text-sm font-medium">{categoryFilter}</span>
              <button
                onClick={clearCategoryFilter}
                className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <span className="text-sm text-gray-500">({filteredProducts.length} products)</span>
          </div>
        )}

        {/* Products Table */}
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
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Stock</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Rating</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.images?.[0]?.url || "/placeholder.jpg"}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium text-gray-800">{product.name}</p>
                              <p className="text-sm text-gray-500">ID: {product.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">${product.price}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${product.stock > 10 ? 'bg-green-100 text-green-700' :
                            product.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                            {product.stock} units
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          ⭐ {product.ratings ? Number(product.ratings).toFixed(1) : '0.0'} ({product.num_of_reviews || 0})
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleView(product)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateProductModal
          onClose={() => {
            setShowCreateModal(false);
            fetchProducts();
          }}
        />
      )}
      {showUpdateModal && selectedProduct && (
        <UpdateProductModal
          product={selectedProduct}
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedProduct(null);
            fetchProducts();
          }}
        />
      )}
      {showViewModal && selectedProduct && (
        <ViewProductModal
          product={selectedProduct}
          onClose={() => {
            setShowViewModal(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default Products;
