import { useState, useEffect, useRef } from "react";
import { X, Search, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toggleSearchBar } from "../../store/slices/popupSlice";

const SearchOverlay = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSearchBarOpen } = useSelector((state) => state.popup);
  const inputRef = useRef(null); //isSearchbarOpen
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (isSearchBarOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchBarOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Navigate to products page with search query (mock implementation as we don't have search param logic in Products page yet)
      // Ideally: navigate(`/products?search=${query}`);
      // For now, just navigate to products
      navigate(`/products?search=${encodeURIComponent(query)}`);
      dispatch(toggleSearchBar());
      setQuery("");
    }
  };

  if (!isSearchBarOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-background/95 backdrop-blur-md transition-opacity pt-20">
      <button
        onClick={() => dispatch(toggleSearchBar())}
        className="absolute right-6 top-6 rounded-full p-2 hover:bg-accent hover:text-foreground transition-colors"
      >
        <X size={24} />
      </button>

      <div className="w-full max-w-3xl px-4 animate-fade-in-down">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            className="w-full rounded-2xl border-2 border-border bg-card py-6 pl-14 pr-14 text-xl font-medium text-foreground shadow-lg focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-primary p-2 text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-8">
          <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Popular Searches
          </h3>
          <div className="flex flex-wrap gap-2">
            {["Wireless Headphones", "Smart Watch", "Running Shoes", "Leather Bag"].map((term) => (
              <button
                key={term}
                onClick={() => {
                  setQuery(term);
                  // handleSearch({ preventDefault: () => {} }); // Auto search on click
                }}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:border-primary hover:text-primary transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
