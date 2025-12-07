import { useEffect, useState } from "react";
import { Search, Sparkles, Star, Filter, X } from "lucide-react";
// import { categories } from "../data/products";
import ProductCard from "../components/Products/ProductCard";
import Pagination from "../components/Products/Pagination";

import CategoriesSidebar from "../components/Layout/CategoriesSidebar";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchAllProducts, fetchAIFilteredProducts } from "../store/slices/productSlice";

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, totalProducts, aiSearching } = useSelector((state) => state.product);

  const [filteredProducts, setFilteredProducts] = useState([]);
  // const [selectedCategory, setSelectedCategory] = useState("All"); // Removed in favor of URL params
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search");
  const categoryParam = searchParams.get("category");

  useEffect(() => {
    if (searchQuery) {
      // Use AI search if there is a search query
      dispatch(fetchAIFilteredProducts(searchQuery));
    } else {
      // Otherwise use standard fetch with filters
      const params = {
        category: categoryParam || undefined,
        // price: priceRange, 
        // rating: sortBy === "rating" ? 4 : undefined, 
        page: currentPage,
      };
      dispatch(fetchAllProducts(params));
    }
  }, [dispatch, searchQuery, categoryParam, currentPage]);

  useEffect(() => {
    // Client-side sorting for now as backend sort might be limited
    let result = Array.isArray(products) ? [...products] : [];
    if (sortBy === "price-low") {
      result.sort((a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0));
    } else if (sortBy === "rating") {
      result.sort((a, b) => parseFloat(b.ratings || 0) - parseFloat(a.ratings || 0));
    }
    setFilteredProducts(result);
  }, [products, sortBy]);

  // Use backend pagination if available, otherwise client-side
  const totalPages = totalProducts > 0
    ? Math.ceil(totalProducts / 10) // Backend uses 10 per page
    : Math.ceil(filteredProducts.length / productsPerPage);

  const currentProducts = totalProducts > 0
    ? filteredProducts // Backend already paginated
    : filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  return (
    <div className="min-h-screen bg-background pt-48 lg:pt-52 pb-10">
      <div className="container mx-auto px-4">
        {/* Header & Controls */}
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-extrabold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Our Collection
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover our curated selection of premium products
            </p>
            {totalProducts > 0 && (
              <p className="mt-2 text-sm text-muted-foreground">
                {totalProducts} {totalProducts === 1 ? 'product' : 'products'} available
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none rounded-lg border border-border bg-card px-4 py-2 pr-8 text-foreground focus:border-primary focus:outline-none"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <Filter className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Categories Sidebar */}
          <CategoriesSidebar />

          {/* Product Grid */}
          <div className="flex-1">
            {(loading || aiSearching) ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
                    <div className="aspect-[3/4] skeleton rounded-t-2xl" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 skeleton rounded w-3/4" />
                      <div className="h-6 skeleton rounded w-full" />
                      <div className="h-4 skeleton rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : currentProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {currentProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="mt-12">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 text-center p-12">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                  <Search className="h-12 w-12 text-primary" />
                </div>
                <h3 className="mb-2 text-2xl font-bold text-foreground">No products found</h3>
                <p className="mb-6 text-muted-foreground max-w-md">
                  We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={() => {
                    // setSelectedCategory("All"); // Removed
                    setSortBy("newest");
                    setCurrentPage(1);
                    // Navigate to remove category param
                    window.history.pushState({}, '', '/products');
                    // Force re-render or dispatch? Better to use navigate from router but we are inside a button handler
                    // Actually, let's just reload or use a proper navigation if we had access to navigate hook here easily without refactoring everything
                    // For now, let's just clear the param by navigating
                    window.location.href = '/products';
                  }}
                  className="rounded-xl bg-gradient-to-r from-primary to-blue-600 px-6 py-3 font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
