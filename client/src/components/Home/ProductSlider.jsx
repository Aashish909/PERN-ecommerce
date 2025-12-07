import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../Products/ProductCard";

const ProductSlider = ({ title, products, badge }) => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div className="mb-8 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold text-foreground">{title}</h2>
          {badge && (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-yellow-200">
              {badge}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="rounded-full border border-border p-2 hover:bg-accent hover:text-foreground transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="rounded-full border border-border p-2 hover:bg-accent hover:text-foreground transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => (
          <div key={product.id} className="min-w-[200px] max-w-[240px] sm:min-w-[220px] md:min-w-[240px] snap-start flex-shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductSlider;
