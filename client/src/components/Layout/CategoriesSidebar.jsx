import { useState, useEffect, useRef } from "react";
import { ChevronRight, ChevronDown, Menu, Star, Check, Loader2 } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
// import axios from "axios";

const FilterSection = ({ title, children, isOpen: defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="font-bold text-gray-800 text-sm">{title}</span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-5 pb-4">
          {children}
        </div>
      </div>
    </div>
  );
};

const DualRangeSlider = ({ min, max, onChange }) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef(null);

  // Convert to percentage
  const getPercent = (value) => Math.round(((value - min) / (max - min)) * 100);

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="relative w-full h-1 bg-gray-200 rounded-lg mt-2 mb-6">
        <div ref={range} className="absolute h-1 bg-primary rounded-lg z-10" />
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={(event) => {
            const value = Math.min(Number(event.target.value), maxVal - 1);
            setMinVal(value);
            minValRef.current = value;
            onChange([value, maxVal]);
          }}
          className="thumb thumb--left absolute w-full h-0 z-20 outline-none pointer-events-none appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm"
          style={{ zIndex: minVal > max - 100 && "5" }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={(event) => {
            const value = Math.max(Number(event.target.value), minVal + 1);
            setMaxVal(value);
            maxValRef.current = value;
            onChange([minVal, value]);
          }}
          className="thumb thumb--right absolute w-full h-0 z-20 outline-none pointer-events-none appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <input
            type="number"
            value={minVal}
            onChange={(e) => {
              const val = Math.min(Number(e.target.value), maxVal - 1);
              setMinVal(val);
              onChange([val, maxVal]);
            }}
            className="w-full pl-3 pr-2 py-1.5 text-sm border border-gray-200 rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
        <span className="text-gray-400">-</span>
        <div className="relative flex-1">
          <input
            type="number"
            value={maxVal}
            onChange={(e) => {
              const val = Math.max(Number(e.target.value), minVal + 1);
              setMaxVal(val);
              onChange([minVal, val]);
            }}
            className="w-full pl-3 pr-2 py-1.5 text-sm border border-gray-200 rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
      </div>
    </div>
  );
};

import { axiosInstance } from "../../lib/axios";

const CategoriesSidebar = () => {
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get("category");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/product/categories");
        if (response.data.success) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="w-full lg:w-64 flex-shrink-0">
      <div className="sticky top-24">
        {/* Categories Section */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
          <FilterSection title="Categories">
            {loading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="animate-spin text-primary" size={24} />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate("/products")}
                  className={`flex items-center gap-3 px-2 py-1.5 rounded-lg transition-colors text-left ${!currentCategory
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <span className="text-sm">All Categories</span>
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => navigate(`/products?category=${encodeURIComponent(category)}`)}
                    className={`flex items-center gap-3 px-2 py-1.5 rounded-lg transition-colors text-left ${currentCategory === category
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <span className="text-sm">{category}</span>
                  </button>
                ))}
              </div>
            )}
          </FilterSection>
        </div>

        {/* Price Range Section - Moved to top as per image */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
          <FilterSection title="Price Range">
            <DualRangeSlider min={0} max={1000} onChange={setPriceRange} />
          </FilterSection>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">

          {/* Brands Section */}
          <FilterSection title="Brands">
            <div className="flex flex-col gap-3">
              {['Mac', 'Karts', 'Baals', 'Bukks', 'Luasis'].map((brand) => (
                <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input type="checkbox" className="peer h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20 transition-all" />
                  </div>
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{brand}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Status Section */}
          <div className="border-b border-gray-100 last:border-0 p-5">
            <div className="flex flex-col gap-3">
              {['On Sale', 'In Stock', 'Featured'].map((status) => (
                <label key={status} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input type="checkbox" className="peer h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20 transition-all" />
                  </div>
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating Section */}
          <FilterSection title="Ratings">
            <div className="flex flex-col gap-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20" />
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={`${i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 group-hover:text-gray-600">& Up</span>
                </label>
              ))}
            </div>
          </FilterSection>

        </div>
      </div>
    </div>
  );
};

export default CategoriesSidebar;
