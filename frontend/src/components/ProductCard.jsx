// ─── ProductCard.jsx ──────────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function formatPrice(price) {
  return `₹${Number(price || 0).toLocaleString("en-IN")}`;
}

export default function ProductCard({ product }) {
  const fallbackImage = "https://picsum.photos/seed/ecom-fallback/1200/900";
  const [imageSrc, setImageSrc] = useState(product.imageUrl || fallbackImage);

  useEffect(() => {
    setImageSrc(product.imageUrl || fallbackImage);
  }, [product.imageUrl]);

  return (
    <article className="volt-product-card">
      <Link className="block h-full" to={`/products/${product._id}`}>
        <div className="volt-product-card-img">
          <img
            alt={product.title}
            className="h-full w-full object-cover"
            src={imageSrc}
            onError={() => setImageSrc(fallbackImage)}
          />
          <div className="volt-product-card-type">
            <span className="volt-badge-pill">{product.type || "General"}</span>
          </div>
        </div>

        <div className="volt-product-card-body">
          <h3 className="volt-product-card-title">{product.title}</h3>
          <p className="volt-product-card-desc">{product.description}</p>
          <div className="volt-product-card-footer">
            <span className="volt-product-card-price">{formatPrice(product.price)}</span>
            <span className="volt-product-card-cta">VIEW →</span>
          </div>
        </div>
      </Link>
    </article>
  );
}