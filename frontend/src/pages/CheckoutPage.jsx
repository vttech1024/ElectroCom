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

  if (error && !product) return <div className="surface-card p-6 text-[15px] error-text">{error}</div>;
  if (!product) return <div className="surface-card p-6 text-[15px] text-[var(--olive-gray)]">Loading checkout...</div>;

  return (
    <section className="space-y-6">
      <h1 className="section-title">Checkout</h1>

      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="surface-card p-6">
          <p className="eyebrow">Order item</p>
          <div className="mt-4 grid gap-5 sm:grid-cols-[220px_1fr]">
            <div className="overflow-hidden rounded-[16px] bg-[var(--warm-sand)]">
              <img alt={product.title} className="h-[220px] w-full object-cover" src={imageSrc} onError={() => setImageSrc(FALLBACK_IMAGE)} />
            </div>
            <div className="space-y-3">
              <Badge>{product.type || "General"}</Badge>
              <h2 className="section-subheading text-[var(--near-black)]">{product.title}</h2>
              <p className="text-[15px] leading-[1.6] text-[var(--olive-gray)]">{product.description}</p>
              <p className="text-[22px] font-medium text-[var(--near-black)]">₹{Number(product.price || 0).toLocaleString("en-IN")}</p>
              <p className="text-[14px] font-medium text-[var(--olive-gray)]">Stock available: {product.stock}</p>
            </div>
          </div>
        </div>

        <aside className="surface-card p-6">
          <p className="eyebrow">Order summary</p>
          <div className="mt-4 space-y-4">
            <div>
              <p className="mb-1 text-[13px] text-[var(--olive-gray)]">Quantity</p>
              <Input aria-label="Quantity" min="1" type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))} />
            </div>
            <div className="space-y-2 rounded-[12px] border border-[var(--border-warm)] bg-[var(--white)] p-4 text-[14px]">
              <div className="flex items-center justify-between">
                <span className="text-[var(--olive-gray)]">Subtotal</span>
                <span className="font-medium text-[var(--near-black)]">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--olive-gray)]">Shipping</span>
                <span className="font-medium text-[var(--near-black)]">{shipping === 0 ? "Free" : `₹${shipping.toLocaleString("en-IN")}`}</span>
              </div>
              <div className="flex items-center justify-between border-t border-[var(--border-warm)] pt-2">
                <span className="font-medium text-[var(--near-black)]">Order total</span>
                <span className="text-[20px] font-medium text-[var(--near-black)]">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <p className="text-[12px] text-[var(--stone-gray)]">Payment method: Cash on Delivery</p>
            {error && <p className="text-[13px] error-text">{error}</p>}
            <Button className="w-full !py-3" disabled={placing} onClick={placeOrder}>
              {placing ? "Placing order..." : "Place COD Order"}
            </Button>
          </div>
        </aside>
      </div>
    </section>
  );
}
