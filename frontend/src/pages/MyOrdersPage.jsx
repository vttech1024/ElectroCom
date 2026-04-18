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
    <section className="space-y-6">
      <div>
        <h1 className="section-title">My orders</h1>
        <p className="mt-2 text-[15px] text-[var(--olive-gray)]">Track your purchases and COD order status.</p>
      </div>

      {error && <div className="surface-card p-5 text-[15px] error-text">{error}</div>}
      {!error && orders.length === 0 && <div className="surface-card p-5 text-[15px] text-[var(--olive-gray)]">No orders yet.</div>}

      <div className="flex flex-col gap-5">
        {orders.map((order) => (
          <Link key={order._id} state={{ from: "/my-orders" }} to={`/orders/${order._id}`}>
            <article className="surface-card p-5 transition hover:-translate-y-0.5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[13px] text-[var(--olive-gray)]">Order ID: {order._id}</p>
                <span className="status-pill">{order.status}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-6 text-[14px] text-[var(--olive-gray)]">
                <p>Payment: {order.paymentMethod}</p>
                <p className="font-medium text-[var(--near-black)]">Total: ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}</p>
              </div>
              <div className="mt-4 space-y-3 border-t border-[var(--border-warm)] pt-4">
                {order.items.map((item, idx) => (
                  <div className="grid gap-3 rounded-[12px] border border-[var(--border-warm)] bg-[var(--white)] p-3 sm:grid-cols-[72px_1fr]" key={`${order._id}-${idx}`}>
                    <img
                      alt={item.title}
                      className="h-[72px] w-[72px] rounded-[10px] object-cover"
                      src={item.imageUrl || FALLBACK_IMAGE}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                    <div className="space-y-1">
                      <p className="text-[15px] font-medium text-[var(--near-black)]">{item.title}</p>
                      <p className="text-[13px] text-[var(--olive-gray)]">Qty: {item.quantity}</p>
                      <p className="text-[13px] text-[var(--olive-gray)]">Price: ₹{Number(item.price || 0).toLocaleString("en-IN")}</p>
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
