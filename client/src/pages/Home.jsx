import React from "react";
import HeroSlider from "../components/Home/HeroSlider";
import CategoryGrid from "../components/Home/CategoryGrid";
import ProductSlider from "../components/Home/ProductSlider";
import FeatureSection from "../components/Home/FeatureSection";
import FAQSection from "../components/Home/FAQSection";
import TrustedBrands from "../components/Home/TrustedBrands";
import NewsletterSection from "../components/Home/NewsletterSection";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchAllProducts } from "../store/slices/productSlice";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import FlashSale from "../components/Home/FlashSale";

const Index = () => {
  const dispatch = useDispatch();
  const { topRatedProducts, newProducts } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(fetchAllProducts({}));
  }, [dispatch]);

  // Use newProducts as dummy data for Trending if not available
  const trendingProducts = newProducts ? [...newProducts].reverse() : [];

  return (
    <div className="min-h-screen">

      {/* Hero Section with Categories Sidebar */}
      <div className="container mx-auto px-4 pt-48 lg:pt-52 pb-12">{" "}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Hero Slider */}
          <div className="flex-1">
            <HeroSlider />
          </div>

          {/* Promotional Cards */}
          <div className="lg:w-80 flex-shrink-0 space-y-4 h-[290px]">
            <Link
              to="/products?category=Fashion"
              className="block relative overflow-hidden rounded-2xl bg-gray-900 p-6 text-white h-full min-h-[200px] group hover:scale-105 transition-transform"
            >
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
                alt="Winter Sale"
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-opacity"
              />
              <div className="relative z-10">
                <p className="text-sm font-medium mb-1 opacity-90">New Arrivals</p>
                <h3 className="text-2xl font-bold mb-2">Winter Sale</h3>
                <p className="text-lg font-semibold mb-4">20% OFF</p>
                <div className="flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all">
                  <span>EXPLORE NOW</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>

            <Link
              to="/products?category=Electronics"
              className="block relative overflow-hidden rounded-2xl bg-gray-900 p-6 text-white h-full min-h-[200px] group hover:scale-105 transition-transform"
            >
              <img
                src="https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=2070&auto=format&fit=crop"
                alt="Airpods Pro"
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-opacity"
              />
              <div className="relative z-10">
                <p className="text-sm font-medium mb-1 opacity-90">Accessories</p>
                <h3 className="text-2xl font-bold mb-2">Airpods Pro</h3>
                <p className="text-lg font-semibold mb-4">30% OFF</p>
                <div className="flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all">
                  <span>EXPLORE NOW</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4 space-y-16">

        {/* 1. New Arrivals */}
        {newProducts && newProducts.length > 0 && (
          <ProductSlider title="New Arrivals" products={newProducts} />
        )}

        {/* 2. Best Sellers */}
        {topRatedProducts && topRatedProducts.length > 0 && (
          <ProductSlider
            title="Best Sellers"
            products={topRatedProducts}
            badge="⭐ Highly recommended"
          />
        )}

        {/* 3. Trending Now */}
        <ProductSlider
          title="Trending Now"
          products={trendingProducts}
        />

        {/* 4. Deals of the Day */}
        <FlashSale />

        {/* 5. Brand Spotlight */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-foreground">Brand Spotlight</h2>
          <TrustedBrands />
        </div>

        {/* 6. Featured Collections */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-foreground">Featured Collections</h2>
          <CategoryGrid />
        </div>

        <FeatureSection />
        <FAQSection />
        <NewsletterSection />
      </div>
    </div>
  );
};

export default Index;
