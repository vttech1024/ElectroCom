import { ArrowLeft, Package } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import api from "../api";
import { Button } from "../components/ui/Button";

const FALLBACK_IMAGE = "https://picsum.photos/seed/ecom-fallback/1200/900";
const TRACKING_STEPS = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const backTo = location.state?.from || "/my-orders";
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    api
      .get(`/orders/${orderId}`)
      .then((response) => setOrder(response.data))
      .catch((err) => setError(err?.response?.data?.message || "Failed to load order"));
  }, [orderId]);

  const itemTotal = useMemo(() => {
    if (!order) return 0;
    return order.items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
  }, [order]);

  const statusIndex = useMemo(() => TRACKING_STEPS.indexOf(order?.status), [order?.status]);
  const canCancel = order && order.status !== "DELIVERED" && order.status !== "CANCELLED";

  const cancelOrder = async () => {
    setActionError("");
    setCanceling(true);
    try {
      const response = await api.patch(`/orders/${orderId}/cancel`);
      setOrder(response.data);
    } catch (err) {
      setActionError(err?.response?.data?.message || "Failed to cancel order");
    } finally {
      setCanceling(false);
    }
  };

  if (error) return (
    <div className="volt-card p-6 text-[13px] font-mono text-[var(--volt-danger)]">
      <span className="text-[var(--volt-muted)] mr-2">ERR:</span>{error}
    </div>
  );
  if (!order) return (
    <div className="volt-card p-6 text-[13px] font-mono text-[var(--volt-muted)] flex items-center gap-3">
      <span className="volt-loader" /> Loading order...
    </div>
  );

  return (
    <section className="volt-section">
      <Link className="volt-back-link" to={backTo}>
        <ArrowLeft size={14} /> BACK TO ORDERS
      </Link>

      {/* Order Header */}
      <div className="volt-card p-0 overflow-hidden">
        <div className="volt-card-header flex-wrap gap-3">
          <div>
            <span className="volt-label">ORDER ID</span>
            <p className="font-mono text-[13px] text-[var(--volt-fg)] mt-1">{order._id}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`volt-status-chip volt-status-${order.status?.toLowerCase()}`}>{order.status}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 divide-x divide-[var(--volt-border)] border-t border-[var(--volt-border)]">
          <div className="volt-meta-cell">
            <span className="volt-label">PAYMENT</span>
            <span className="volt-meta-val">{order.paymentMethod}</span>
          </div>
          <div className="volt-meta-cell">
            <span className="volt-label">ITEMS</span>
            <span className="volt-meta-val">{order.items.length}</span>
          </div>
          <div className="volt-meta-cell">
            <span className="volt-label">TOTAL</span>
            <span className="volt-meta-val text-[var(--volt-accent)]">₹{Number(order.totalAmount || itemTotal).toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
        {/* Items */}
        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <article className="volt-card p-0 overflow-hidden" key={`${order._id}-${idx}`}>
              <div className="grid sm:grid-cols-[100px_1fr_auto] sm:items-center gap-0">
                <img
                  alt={item.title}
                  className="h-[100px] w-[100px] object-cover"
                  src={item.imageUrl || FALLBACK_IMAGE}
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; }}
                />
                <div className="px-4 py-3 space-y-1">
                  <p className="text-[15px] font-semibold text-[var(--volt-fg)] tracking-tight">{item.title}</p>
                  <p className="text-[12px] font-mono text-[var(--volt-muted)] leading-relaxed line-clamp-2">{item.description || "No description."}</p>
                  <div className="flex items-center gap-3 pt-1">
                    <span className="volt-qty-badge">QTY: {item.quantity}</span>
                  </div>
                </div>
                <div className="px-4 py-3 text-right shrink-0">
                  <p className="text-[16px] font-bold text-[var(--volt-fg)] font-mono">₹{(Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString("en-IN")}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Tracking Panel */}
        <aside className="volt-card p-0 overflow-hidden self-start">
          <div className="volt-card-header">
            <Package size={14} className="text-[var(--volt-accent)]" />
            <span className="volt-label ml-2">TRACKING</span>
          </div>
          <div className="p-5">
            {order.status === "CANCELLED" ? (
              <div className="volt-cancelled-banner">
                <span className="font-mono text-[12px]">ORDER CANCELLED</span>
              </div>
            ) : (
              <div className="volt-tracking-rail">
                {TRACKING_STEPS.map((step, idx) => {
                  const done = idx <= statusIndex;
                  const active = idx === statusIndex;
                  return (
                    <div className={`volt-track-step ${done ? "volt-track-step--done" : ""} ${active ? "volt-track-step--active" : ""}`} key={step}>
                      <div className="volt-track-indicator">
                        <span className="volt-track-dot" />
                        {idx < TRACKING_STEPS.length - 1 && <span className="volt-track-line" />}
                      </div>
                      <div className="volt-track-info">
                        <span className="volt-track-label">{step}</span>
                        {done && <span className="volt-track-check">✓</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {canCancel && (
              <div className="mt-5 pt-5 border-t border-[var(--volt-border)]">
                <button className="volt-btn-danger w-full" disabled={canceling} onClick={cancelOrder}>
                  {canceling ? "CANCELLING..." : "CANCEL ORDER"}
                </button>
              </div>
            )}
            {actionError && (
              <p className="mt-3 text-[12px] font-mono text-[var(--volt-danger)]">{actionError}</p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}