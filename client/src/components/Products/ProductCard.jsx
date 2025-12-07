import { ShoppingCart, Star, Heart, Sparkles } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  const rating = (product.ratings || product.rating || 0);
  const isNew = product.created_at && new Date(product.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const stockStatus = product.stock > 5 ? "in-stock" : product.stock > 0 ? "low-stock" : "out-of-stock";

  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Badges */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
        {isNew && (
          <span className="rounded bg-primary px-2 py-1 text-[10px] font-bold text-white">
            NEW
          </span>
        )}
        {rating >= 4.5 && (
          <span className="rounded bg-amber-400 px-2 py-1 text-[10px] font-bold text-white flex items-center gap-1">
            <Sparkles size={10} />
            TOP
          </span>
        )}
        {product.discount > 0 && (
          <span className="rounded bg-red-500 px-2 py-1 text-[10px] font-bold text-white">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
        <img
          src={Array.isArray(product.images) && product.images.length > 0
            ? (product.images[0]?.url || product.images[0])
            : "https://placehold.co/400"}
          alt={product.name}
          className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Action Buttons (Right Side) */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="rounded-full bg-white p-2 text-gray-600 shadow-md transition-all hover:bg-primary hover:text-white"
            aria-label="Add to favorites"
          >
            <Heart size={18} />
          </button>
        </div>

        {/* Stock Overlay */}
        {stockStatus === "out-of-stock" && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <span className="text-sm font-bold text-red-500">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Product Name */}
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-gray-800 transition-colors group-hover:text-primary">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="mb-2 flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={12}
              fill={i < Math.floor(rating) ? "#fbbf24" : "none"}
              className={i < Math.floor(rating) ? "text-amber-400" : "text-gray-300"}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">({rating})</span>
        </div>

        {/* Price & Add to Cart */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              ${parseFloat(product.price || 0).toFixed(2)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-gray-400 line-through">
                ${parseFloat(product.oldPrice).toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="rounded-lg border border-primary text-primary p-2 hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Add to cart"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
