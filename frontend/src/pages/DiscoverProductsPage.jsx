import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import ProductCard from "../components/ProductCard";

function SwipeSection({ title, products, accent }) {
  const rowRef = useRef(null);
  const scrollRow = (direction) => {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({ left: direction * 900, behavior: "smooth" });
  };
  if (products.length === 0) return null;

  return (
    <section className="volt-swipe-section">
      <div className="volt-swipe-header">
        <div className="flex items-center gap-3">
          {accent && <span className="volt-section-accent" />}
          <h2 className="volt-section-title">{title}</h2>
        </div>
        <div className="flex items-center gap-1">
          <button aria-label={`Scroll ${title} left`} className="volt-arrow-btn" onClick={() => scrollRow(-1)} type="button">
            <ChevronLeft size={14} />
          </button>
          <button aria-label={`Scroll ${title} right`} className="volt-arrow-btn" onClick={() => scrollRow(1)} type="button">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
      <div className="volt-swipe-row" ref={rowRef}>
        {products.map((product) => (
          <div className="volt-swipe-item" key={`${title}-${product._id}`}>
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
    <section className="volt-section">
      {/* Hero Banner */}
      <div className="volt-hero">
        <div className="volt-hero-grid-bg" />
        <div className="volt-hero-content">
          <div className="volt-hero-tag">
            <Zap size={11} className="inline-block mr-1" />
            VOLT STORE
          </div>
          <h1 className="volt-hero-title">
            Next-Gen<br />Electronics
          </h1>
          <p className="volt-hero-sub">
            Cutting-edge tech. Direct delivery. Cash on arrival.
          </p>
        </div>
        <div className="volt-hero-stat-strip">
          <div className="volt-stat"><span className="volt-stat-num">50K+</span><span>Products</span></div>
          <div className="volt-stat-divider" />
          <div className="volt-stat"><span className="volt-stat-num">FREE</span><span>Shipping</span></div>
          <div className="volt-stat-divider" />
          <div className="volt-stat"><span className="volt-stat-num">COD</span><span>Available</span></div>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="volt-filter-bar">
        <span className="volt-label mr-3 shrink-0">CATEGORY</span>
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {types.map((type) => (
            <button
              className={`volt-filter-pill ${selectedType === type ? "volt-filter-pill--active" : ""}`}
              key={type}
              onClick={() => setSelectedType(type)}
              type="button"
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="volt-card p-6 text-[13px] font-mono text-[var(--volt-muted)] flex items-center gap-3">
          <span className="volt-loader" /> Fetching products...
        </div>
      )}
      {!loading && error && (
        <div className="volt-card p-6 text-[13px] font-mono text-[var(--volt-danger)]">
          <span className="mr-2 text-[var(--volt-muted)]">ERR:</span>{error}
        </div>
      )}
      {!loading && !error && filteredProducts.length === 0 && (
        <div className="volt-card p-6 text-[13px] font-mono text-[var(--volt-muted)]">
          — No products match this filter.
        </div>
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <>
          <SwipeSection accent products={recommended} title="FEATURED PICKS" />
          <SwipeSection products={trending} title="HIGH VALUE DEALS" />
          <SwipeSection products={topRated} title="BEST IN STOCK" />

          <section className="space-y-4">
            <div className="volt-swipe-header">
              <h2 className="volt-section-title">ALL PRODUCTS</h2>
              <span className="volt-count-badge">{filteredProducts.length} items</span>
            </div>
            <div className="volt-products-grid">
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