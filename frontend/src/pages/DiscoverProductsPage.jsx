import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import ProductCard from "../components/ProductCard";

function SwipeSection({ title, products }) {
  const rowRef = useRef(null);

  const scrollRow = (direction) => {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({ left: direction * 900, behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="section-subheading text-[var(--near-black)]">{title}</h2>
        <div className="flex items-center gap-2">
          <button aria-label={`Scroll ${title} left`} className="swipe-btn" onClick={() => scrollRow(-1)} type="button">
            <ChevronLeft size={16} />
          </button>
          <button aria-label={`Scroll ${title} right`} className="swipe-btn" onClick={() => scrollRow(1)} type="button">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div className="swipe-row" ref={rowRef}>
        {products.map((product) => (
          <div className="swipe-item" key={`${title}-${product._id}`}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function DiscoverProductsPage() {
  const [products, setProducts] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async (q = "") => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/products", { params: q ? { q } : undefined });
      setProducts(response.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load products");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts(searchParams.get("q") || "");
  }, [searchParams]);

  const types = useMemo(() => {
    const allTypes = products.map((item) => item.type || "General");
    return ["All", ...Array.from(new Set(allTypes))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedType === "All") return products;
    return products.filter((item) => (item.type || "General").toLowerCase() === selectedType.toLowerCase());
  }, [products, selectedType]);

  const recommended = useMemo(() => filteredProducts.slice(0, 12), [filteredProducts]);
  const trending = useMemo(() => [...filteredProducts].sort((a, b) => b.price - a.price).slice(0, 12), [filteredProducts]);
  const topRated = useMemo(() => [...filteredProducts].sort((a, b) => b.stock - a.stock).slice(0, 12), [filteredProducts]);

  return (
    <section className="space-y-10">
      <div className="surface-card-dark p-8 md:p-10">
        <p className="eyebrow">Discover</p>
        <h1 className="section-title mt-3 text-[var(--ivory)]">Thoughtful products for everyday living.</h1>
        <p className="mt-3 max-w-3xl text-[17px] text-[var(--warm-silver)]">Browse curated inventory with warm, editorial shopping flows and transparent cash-on-delivery checkout.</p>
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {types.map((type) => (
          <button
            className={`rounded-full border px-4 py-2 text-[13px] font-medium transition ${selectedType === type ? "border-[var(--terracotta)] bg-[var(--terracotta)] text-[var(--ivory)]" : "border-[var(--border-warm)] bg-[var(--ivory)] text-[var(--olive-gray)] hover:text-[var(--near-black)]"}`}
            key={type}
            onClick={() => setSelectedType(type)}
            type="button"
          >
            {type}
          </button>
        ))}
      </div>

      {loading && <div className="surface-card p-6 text-[15px] text-[var(--olive-gray)]">Loading products...</div>}
      {!loading && error && <div className="surface-card p-6 text-[15px] error-text">{error}</div>}
      {!loading && !error && filteredProducts.length === 0 && <div className="surface-card p-6 text-[15px] text-[var(--olive-gray)]">No products found.</div>}

      {!loading && !error && filteredProducts.length > 0 && (
        <>
          <SwipeSection products={recommended} title="Recommended for you" />
          <SwipeSection products={trending} title="Trending deals" />
          <SwipeSection products={topRated} title="Top picks in stock" />

          <section className="space-y-3">
            <h2 className="section-subheading text-[var(--near-black)]">More products</h2>
            <div className="products-grid-3">
              {filteredProducts.map((product) => (
                <ProductCard key={`grid-${product._id}`} product={product} />
              ))}
            </div>
          </section>
        </>
      )}
    </section>
  );
}
