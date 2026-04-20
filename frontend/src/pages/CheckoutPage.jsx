import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

const FALLBACK_IMAGE = "https://picsum.photos/seed/ecom-fallback/1200/900";

export default function CheckoutPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [imageSrc, setImageSrc] = useState(FALLBACK_IMAGE);
  const [quantity, setQuantity] = useState(1);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/products/${productId}`)
      .then((response) => {
        setProduct(response.data);
        setImageSrc(response.data?.imageUrl || FALLBACK_IMAGE);
      })
      .catch((err) => setError(err?.response?.data?.message || "Failed to load product"));
  }, [productId]);

  const subtotal = useMemo(() => Number(product?.price || 0) * quantity, [product?.price, quantity]);
  const shipping = 0;
  const total = subtotal + shipping;

  const placeOrder = async () => {
    setPlacing(true);
    setError("");
    try {
      await api.post("/orders", {
        items: [{ productId, quantity }],
        paymentMethod: "COD"
      });
      navigate("/my-orders");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (error && !product) return (
    <div className="volt-card p-6 text-[14px] font-mono text-[var(--volt-danger)]">
      <span className="text-[var(--volt-muted)] mr-2">ERR:</span>{error}
    </div>
  );
  if (!product) return (
    <div className="volt-card p-6 text-[14px] font-mono text-[var(--volt-muted)] flex items-center gap-3">
      <span className="volt-loader" /> Loading product...
    </div>
  );

  return (
    <section className="volt-section">
      <div className="volt-page-header">
        <div className="volt-label">CHECKOUT</div>
        <h1 className="volt-page-title">Complete Your Order</h1>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
        {/* Product Panel */}
        <div className="volt-card p-0 overflow-hidden">
          <div className="volt-card-header">
            <span className="volt-label">ORDER ITEM</span>
          </div>
          <div className="grid sm:grid-cols-[280px_1fr]">
            <div className="volt-img-block">
              <img
                alt={product.title}
                className="h-[280px] w-full object-cover"
                src={imageSrc}
                onError={() => setImageSrc(FALLBACK_IMAGE)}
              />
              <div className="volt-img-overlay">
                <span className="volt-badge-pill">{product.type || "General"}</span>
              </div>
            </div>
            <div className="p-6 flex flex-col justify-between gap-4">
              <div className="space-y-3">
                <h2 className="volt-product-title">{product.title}</h2>
                <p className="volt-body-text">{product.description}</p>
              </div>
              <div className="space-y-2 pt-4 border-t border-[var(--volt-border)]">
                <div className="volt-spec-row">
                  <span className="volt-spec-key">STOCK</span>
                  <span className="volt-spec-val">{product.stock} units</span>
                </div>
                <div className="volt-spec-row">
                  <span className="volt-spec-key">PAYMENT</span>
                  <span className="volt-spec-val">Cash on Delivery</span>
                </div>
                <div className="volt-price-display">
                  ₹{Number(product.price || 0).toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Panel */}
        <aside className="volt-card p-0 overflow-hidden">
          <div className="volt-card-header">
            <span className="volt-label">ORDER SUMMARY</span>
          </div>
          <div className="p-5 space-y-5">
            <div>
              <label className="volt-field-label">QUANTITY</label>
              <input
                aria-label="Quantity"
                className="volt-input"
                min="1"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
              />
            </div>

            <div className="volt-summary-block">
              <div className="volt-summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="volt-summary-row">
                <span>Shipping</span>
                <span className="text-[var(--volt-accent)]">FREE</span>
              </div>
              <div className="volt-summary-total">
                <span>Total</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="volt-cod-badge">
              <span className="volt-dot" />
              Cash on Delivery
            </div>

            {error && (
              <p className="text-[12px] font-mono text-[var(--volt-danger)] bg-[var(--volt-danger-bg)] border border-[var(--volt-danger)] px-3 py-2">
                {error}
              </p>
            )}

            <button className="volt-btn-primary w-full" disabled={placing} onClick={placeOrder}>
              {placing ? (
                <span className="flex items-center justify-center gap-2"><span className="volt-btn-loader" />PLACING ORDER</span>
              ) : "PLACE COD ORDER"}
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}