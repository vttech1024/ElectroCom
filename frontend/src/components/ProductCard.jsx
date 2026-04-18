import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function formatPrice(price) {
  return `₹${Number(price || 0).toLocaleString("en-IN")}`;
}

export default function ProductCard({ product, compact = false }) {
  const fallbackImage = "https://picsum.photos/seed/ecom-fallback/1200/900";
  const [imageSrc, setImageSrc] = useState(product.imageUrl || fallbackImage);

  useEffect(() => {
    setImageSrc(product.imageUrl || fallbackImage);
  }, [product.imageUrl]);

  return (
    <article className="surface-card overflow-hidden transition duration-200 hover:-translate-y-0.5">
      <Link className="block" to={`/products/${product._id}`}>
        <div className="h-[240px] bg-[var(--warm-sand)]">
          <img alt={product.title} className="h-full w-full object-cover" src={imageSrc} onError={() => setImageSrc(fallbackImage)} />
        </div>

        <div className="space-y-2 p-5">
          <h3 className="overflow-hidden text-ellipsis whitespace-nowrap font-['Georgia'] text-[24px] font-medium leading-[1.2]">{product.title}</h3>
          <p className="h-[44px] overflow-hidden text-[14px] leading-[1.6] text-[var(--olive-gray)]">{product.description}</p>
          <p className="pt-1 text-[20px] font-medium text-[var(--near-black)]">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </article>
  );
}
