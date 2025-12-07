import React from "react";
import { X } from "lucide-react";

const ViewProductModal = ({ product, onClose }) => {
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-xl w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh] relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-600 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">{product?.name || "Product Details"}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Images */}
            <div className="grid grid-cols-2 gap-3">
              {product?.images && product.images.length > 0 ? (
                product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img?.url}
                    alt={`Product ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                ))
              ) : (
                <div className="col-span-2 text-center text-gray-500 p-8 border rounded-lg">
                  No images available
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Product ID</p>
                <p className="font-semibold">{product?.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-gray-700">{product?.description || "No description"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-semibold">{product?.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-semibold text-lg">${product?.price}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Rating</p>
                <p>⭐ {product?.ratings?.toFixed(1) || "0.0"} ({product?.num_of_reviews || 0} reviews)</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Stock Status</p>
                <p className={`font-semibold ${product?.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product?.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created At</p>
                <p>{product?.created_at ? new Date(product.created_at).toLocaleDateString() : "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewProductModal;
