// ─── AddProductPage.jsx ───────────────────────────────────────────────────────
import { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../api";

export default function AddProductPage() {
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const onSubmit = async (values) => {
    setMessage(""); setErrorMessage("");
    try {
      await api.post("/products", { ...values, price: Number(values.price), stock: Number(values.stock) });
      reset();
      setMessage("Product listed successfully.");
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Failed to create product");
    }
  };

  return (
    <section className="volt-section">
      <div className="volt-page-header">
        <div className="volt-label">SELLER TOOLS</div>
        <h1 className="volt-page-title">List New Product</h1>
      </div>

      <div className="volt-card p-0 overflow-hidden max-w-2xl">
        <div className="volt-card-header">
          <span className="volt-label">PRODUCT DETAILS</span>
        </div>
        <form className="p-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="volt-field-label">PRODUCT TITLE</label>
            <input className="volt-input" placeholder="e.g. Sony WH-1000XM5 Headphones" {...register("title", { required: true })} />
          </div>

          <div>
            <label className="volt-field-label">CATEGORY</label>
            <select className="volt-input volt-select" defaultValue="" {...register("type", { required: true })}>
              <option disabled value="">Select category</option>
              {["Electronics","Fashion","Home","Beauty","Sports","Books","Kitchen","Office","Toys","Accessories","General"].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="volt-field-label">DESCRIPTION</label>
            <textarea className="volt-input volt-textarea" placeholder="Describe the product specs, features, and condition..." {...register("description", { required: true })} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="volt-field-label">PRICE (₹)</label>
              <input className="volt-input" min="0" placeholder="0.00" step="0.01" type="number" {...register("price", { required: true })} />
            </div>
            <div>
              <label className="volt-field-label">STOCK UNITS</label>
              <input className="volt-input" min="0" placeholder="0" type="number" {...register("stock", { required: true })} />
            </div>
          </div>

          <div>
            <label className="volt-field-label">IMAGE URL <span className="normal-case font-normal text-[var(--volt-muted)]">(optional)</span></label>
            <input className="volt-input" placeholder="https://..." {...register("imageUrl")} />
          </div>

          {message && (
            <div className="volt-success-banner font-mono text-[12px]">✓ {message}</div>
          )}
          {errorMessage && (
            <div className="font-mono text-[12px] text-[var(--volt-danger)] bg-[var(--volt-danger-bg)] border border-[var(--volt-danger)] px-3 py-2">
              ERR: {errorMessage}
            </div>
          )}

          <button className="volt-btn-primary" disabled={isSubmitting} type="submit">
            {isSubmitting ? "SAVING PRODUCT..." : "LIST PRODUCT"}
          </button>
        </form>
      </div>
    </section>
  );
}