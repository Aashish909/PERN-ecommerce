import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Plus,
  Minus,
  Loader,
  ArrowRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ReviewsContainer from "../components/Products/ReviewsContainer";
import ProductCard from "../components/Products/ProductCard";
import { fetchSingleProduct, fetchAllProducts } from "../store/slices/productSlice";
import { toast } from "react-toastify";
import { addToCart } from "../store/slices/cartSlice";
import { categories } from "../data/products";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { productDetails, loading, isPostingReview, isReviewDeleting, products } = useSelector((state) => state.product);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleProduct(id));
    }
  }, [dispatch, id]);

  // Refresh product after review is posted/deleted
  useEffect(() => {
    if (id && (!isPostingReview && !isReviewDeleting)) {
      dispatch(fetchSingleProduct(id));
    }
  }, [dispatch, id, isPostingReview, isReviewDeleting]);

  // Fetch related products
  useEffect(() => {
    if (productDetails?.category) {
      dispatch(fetchAllProducts({ category: productDetails.category, page: 1 }));
    }
  }, [dispatch, productDetails?.category]);

  // Get related products (same category, exclude current product)
  const relatedProducts = (products || [])
    .filter((p) => p.id !== id && p.category === productDetails?.category)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (productDetails.stock <= 0) {
      toast.error("Product is out of stock");
      return;
    }
    dispatch(addToCart({ ...productDetails, quantity }));
    toast.success(`Added ${quantity} ${productDetails.name} to cart`);
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= productDetails.stock) {
      setQuantity(newQuantity);
    }
  };

  if (loading || !productDetails || !productDetails.name) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  const images = productDetails.images || [];
  const getImageUrl = (img) => {
    if (!img) return "https://placehold.co/600";
    if (typeof img === 'string') return img;
    return img.url || img;
  };

  return (
    <div className="min-h-screen bg-background pt-48 lg:pt-52 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-2 mb-12">
          {/* Image Gallery */}
          <div className="space-y-3 w-full lg:max-w-sm mx-auto lg:mx-0">{" "}
            <div className="aspect-square overflow-hidden rounded-xl bg-muted border border-border shadow-md">
              <img
                src={getImageUrl(images[selectedImage])}
                alt={productDetails.name}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${selectedImage === idx
                      ? "border-primary shadow-md scale-105"
                      : "border-border hover:border-primary/50"
                      }`}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`View ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">
                {productDetails.category}
              </p>
              <h1 className="mb-3 text-3xl font-bold text-foreground">
                {productDetails.name}
              </h1>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      fill={i < Math.floor(productDetails.ratings || 0) ? "currentColor" : "none"}
                      className={i < Math.floor(productDetails.ratings || 0) ? "" : "text-muted-foreground/30"}
                    />
                  ))}
                  <span className="ml-2 font-semibold text-foreground">
                    {productDetails.rating?.toFixed(1) || "0.0"}
                  </span>
                </div>
                <span className="text-muted-foreground">
                  ({productDetails.reviews?.length || 0} reviews)
                </span>
                <span className="text-muted-foreground">•</span>
                <span
                  className={`font-semibold ${productDetails.stock > 0 ? "text-green-500" : "text-destructive"
                    }`}
                >
                  {productDetails.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Product Code: <span className="font-mono font-semibold">{productDetails.id?.slice(0, 8).toUpperCase()}</span>
              </p>
            </div>

            <div className="mb-6 p-4 rounded-xl bg-muted/50 border border-border">
              <div className="flex items-baseline gap-3">
                <p className="text-4xl font-bold text-primary">
                  ${parseFloat(productDetails.price || 0).toFixed(2)}
                </p>
                {productDetails.price > 100 && (
                  <p className="text-xl text-muted-foreground line-through">
                    ${(parseFloat(productDetails.price) * 1.2).toFixed(2)}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-6 rounded-xl border border-border bg-card p-4">
              <h3 className="mb-3 font-semibold text-foreground">Description</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {productDetails.description || "No description available for this product."}
              </p>
            </div>

            {/* Options (if needed - placeholder for variant selection) */}
            {productDetails.stock > 0 && (
              <div className="mb-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">Quantity</label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center rounded-xl border-2 border-border bg-card overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="p-3 hover:bg-accent hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus size={20} />
                      </button>
                      <span className="w-16 text-center font-bold text-lg py-3">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= productDetails.stock}
                        className="p-3 hover:bg-accent hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {productDetails.stock} available
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mb-6 flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                disabled={productDetails.stock <= 0}
                className="flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-primary to-blue-600 py-4 font-bold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <ShoppingCart size={22} />
                Add To Cart
              </button>

              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-border bg-card py-3 font-semibold hover:bg-accent hover:border-primary transition-all">
                  <Heart size={20} />
                  Wishlist
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-border bg-card py-3 font-semibold hover:bg-accent hover:border-primary transition-all">
                  <Share2 size={20} />
                  Share
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <h3 className="mb-3 font-semibold text-foreground">Product Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-semibold text-foreground">{productDetails.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SKU:</span>
                  <span className="font-mono font-semibold text-foreground">{productDetails.id?.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stock:</span>
                  <span className={`font-semibold ${productDetails.stock > 0 ? "text-green-500" : "text-destructive"}`}>
                    {productDetails.stock > 0 ? `${productDetails.stock} units` : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ReviewsContainer
          reviews={productDetails.reviews || []}
          productId={productDetails.id}
        />

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">You May Also Like</h2>
              <Link
                to={`/products?category=${encodeURIComponent(productDetails.category)}`}
                className="text-primary hover:underline font-medium flex items-center gap-1"
              >
                View All
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Shop by Category Section */}
        <div className="mt-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">Shop by Category</h2>
            <p className="text-muted-foreground mt-1">Discover our wide range of products across different categories</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="group relative overflow-hidden rounded-xl bg-card border border-border hover:border-primary transition-all duration-300 hover:shadow-lg"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white font-semibold text-sm sm:text-base">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
