import { ArrowLeft, ShieldCheck, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";

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

  if (error) return <div className="surface-card p-6 text-[15px] error-text">{error}</div>;
  if (!product) return <div className="surface-card p-6 text-[15px] text-[var(--olive-gray)]">Loading product...</div>;

  return (
    <section className="space-y-6">
      <Link className="inline-flex items-center gap-2 text-[14px] font-medium text-[var(--olive-gray)] hover:text-[var(--near-black)]" to="/products">
        <ArrowLeft size={16} />
        Back to products
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="surface-card overflow-hidden rounded-[32px]">
          <img
            alt={product.title}
            className="h-[420px] w-full object-cover lg:h-[520px]"
            src={imageSrc}
            onError={() => setImageSrc(fallbackImage)}
          />
        </div>

        <div className="surface-card p-8">
          <Badge>In stock: {product.stock}</Badge>
          <p className="eyebrow mt-3">{product.type || "General"}</p>
          <h1 className="section-heading mt-3 text-[var(--near-black)]">{product.title}</h1>
          <p className="mt-3 text-[16px] leading-[1.6] text-[var(--olive-gray)]">{product.description}</p>
          <p className="mt-6 text-[32px] font-medium text-[var(--near-black)]">{price(product.price)}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="panel p-3">
              <p className="eyebrow">Payment</p>
              <p className="mt-1 text-[15px] font-medium text-[var(--near-black)]">Cash on Delivery</p>
            </div>
            <div className="panel p-3">
              <p className="eyebrow">Availability</p>
              <p className="mt-1 text-[15px] font-medium text-[var(--near-black)]">{product.stock > 0 ? "Ready to ship" : "Out of stock"}</p>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link to={`/checkout/${product._id}`}>
              <Button className="!px-6 !py-3">Buy with COD</Button>
            </Link>
          </div>

          <div className="mt-8 space-y-3 border-t border-[var(--border-warm)] pt-6 text-[14px] text-[var(--olive-gray)]">
            <p className="flex items-center gap-2">
              <Truck size={15} />
              Fast shipping support
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck size={15} />
              Secure order handling
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
