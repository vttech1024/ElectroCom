// ─── MyOrdersPage.jsx ─────────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const FALLBACK_IMAGE = "https://picsum.photos/seed/ecom-fallback/1200/900";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;
    api
      .get(`/orders/my/${userId}`)
      .then((response) => setOrders(response.data))
      .catch((err) => setError(err?.response?.data?.message || "Failed to load orders"));
  }, [userId]);

  return (
    <section className="volt-section">
      <div className="volt-page-header">
        <div className="volt-label">ACCOUNT</div>
        <h1 className="volt-page-title">My Orders</h1>
        <p className="volt-page-sub">Track purchases and COD delivery status.</p>
      </div>

      {error && (
        <div className="volt-card p-5 font-mono text-[13px] text-[var(--volt-danger)]">
          <span className="text-[var(--volt-muted)] mr-2">ERR:</span>{error}
        </div>
      )}
      {!error && orders.length === 0 && (
        <div className="volt-card p-5 font-mono text-[13px] text-[var(--volt-muted)]">
          — No orders placed yet.
        </div>
      )}

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <Link key={order._id} state={{ from: "/my-orders" }} to={`/orders/${order._id}`}>
            <article className="volt-card p-0 overflow-hidden hover:border-[var(--volt-accent)] transition-colors">
              <div className="volt-card-header flex-wrap gap-3">
                <p className="font-mono text-[12px] text-[var(--volt-muted)]">{order._id}</p>
                <span className={`volt-status-chip volt-status-${order.status?.toLowerCase()}`}>{order.status}</span>
              </div>
              <div className="px-5 py-3 flex flex-wrap gap-5 text-[13px] border-b border-[var(--volt-border)]">
                <span className="volt-label">PAYMENT: <span className="text-[var(--volt-fg)] normal-case font-normal">{order.paymentMethod}</span></span>
                <span className="volt-label">TOTAL: <span className="text-[var(--volt-accent)]">₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}</span></span>
              </div>
              <div className="p-4 space-y-3">
                {order.items.map((item, idx) => (
                  <div className="volt-order-item-row" key={`${order._id}-${idx}`}>
                    <img
                      alt={item.title}
                      className="h-[64px] w-[64px] object-cover shrink-0"
                      src={item.imageUrl || FALLBACK_IMAGE}
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; }}
                    />
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <p className="text-[14px] font-semibold text-[var(--volt-fg)] truncate">{item.title}</p>
                      <div className="flex gap-3">
                        <span className="volt-qty-badge">QTY: {item.quantity}</span>
                        <span className="font-mono text-[12px] text-[var(--volt-muted)]">₹{Number(item.price || 0).toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}