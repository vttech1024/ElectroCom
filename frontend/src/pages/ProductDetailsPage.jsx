// ─── ProductDetailsPage.jsx ───────────────────────────────────────────────────
import { ArrowLeft, ShieldCheck, Truck, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";

function price(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const fallbackImage = "https://picsum.photos/seed/ecom-fallback/1200/900";
  const [imageSrc, setImageSrc] = useState(fallbackImage);

  useEffect(() => {
    api
      .get(`/products/${productId}`)
      .then((response) => {
        setProduct(response.data);
        setImageSrc(response.data?.imageUrl || fallbackImage);
      })
      .catch((err) => setError(err?.response?.data?.message || "Failed to load product"));
  }, [productId]);

  if (error) return (
    <div className="volt-card p-6 font-mono text-[13px] text-[var(--volt-danger)]">
      <span className="text-[var(--volt-muted)] mr-2">ERR:</span>{error}
    </div>
  );
  if (!product) return (
    <div className="volt-card p-6 font-mono text-[13px] text-[var(--volt-muted)] flex items-center gap-3">
      <span className="volt-loader" /> Loading product...
    </div>
  );

  return (
    <section className="volt-section">
      <Link className="volt-back-link" to="/products">
        <ArrowLeft size={14} /> ALL PRODUCTS
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* Image Panel */}
        <div className="volt-card p-0 overflow-hidden">
          <div className="volt-img-block-full">
            <img
              alt={product.title}
              className="h-[420px] w-full object-cover lg:h-[500px]"
              src={imageSrc}
              onError={() => setImageSrc(fallbackImage)}
            />
            <div className="volt-img-overlay">
              <span className="volt-badge-pill">{product.type || "General"}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 divide-x divide-[var(--volt-border)] border-t border-[var(--volt-border)]">
            <div className="volt-feature-cell">
              <Truck size={13} className="text-[var(--volt-accent)]" />
              <span>Fast Shipping</span>
            </div>
            <div className="volt-feature-cell">
              <ShieldCheck size={13} className="text-[var(--volt-accent)]" />
              <span>Secure Orders</span>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="volt-card p-0 overflow-hidden flex flex-col">
          <div className="volt-card-header">
            <span className={`volt-stock-indicator ${product.stock > 0 ? "volt-in-stock" : "volt-out-stock"}`}>
              <span className="volt-dot" />
              {product.stock > 0 ? `${product.stock} IN STOCK` : "OUT OF STOCK"}
            </span>
          </div>

          <div className="p-6 flex flex-col flex-1 gap-5">
            <div className="space-y-2">
              <p className="volt-label">{product.type || "GENERAL"}</p>
              <h1 className="volt-product-title-lg">{product.title}</h1>
              <p className="volt-body-text">{product.description}</p>
            </div>

            <div className="volt-price-hero">
              <div className="volt-label mb-1">PRICE</div>
              <div className="volt-price-lg">{price(product.price)}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="volt-spec-card">
                <span className="volt-label">PAYMENT</span>
                <span className="volt-spec-card-val">Cash on Delivery</span>
              </div>
              <div className="volt-spec-card">
                <span className="volt-label">AVAILABILITY</span>
                <span className="volt-spec-card-val">{product.stock > 0 ? "Ready to ship" : "Unavailable"}</span>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-[var(--volt-border)]">
              <Link to={`/checkout/${product._id}`}>
                <button className="volt-btn-primary w-full flex items-center justify-center gap-2">
                  <Zap size={14} /> BUY WITH COD
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}