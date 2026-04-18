import { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../api";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export default function AddProductPage() {
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm();

  const onSubmit = async (values) => {
    setMessage("");
    setErrorMessage("");
    try {
      await api.post("/products", {
        ...values,
        price: Number(values.price),
        stock: Number(values.stock)
      });
      reset();
      setMessage("Product listed successfully.");
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Failed to create product");
    }
  };

  return (
    <section className="mx-auto max-w-3xl">
      <div className="surface-card rounded-[32px] p-8">
        <p className="eyebrow">Seller tools</p>
        <h1 className="section-heading mt-2">Add new product</h1>
        <p className="mt-2 text-[15px] text-[var(--olive-gray)]">Build a clean listing with title, image, pricing, and stock.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input aria-label="Product title" placeholder="Product title" {...register("title", { required: true })} />
          <select aria-label="Product type" className="input-control" defaultValue="" {...register("type", { required: true })}>
            <option disabled value="">
              Select product type
            </option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Home">Home</option>
            <option value="Beauty">Beauty</option>
            <option value="Sports">Sports</option>
            <option value="Books">Books</option>
            <option value="Kitchen">Kitchen</option>
            <option value="Office">Office</option>
            <option value="Toys">Toys</option>
            <option value="Accessories">Accessories</option>
            <option value="General">General</option>
          </select>
          <textarea aria-label="Product description" className="input-control min-h-[140px]" placeholder="Product description" {...register("description", { required: true })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input aria-label="Price" min="0" placeholder="Price" step="0.01" type="number" {...register("price", { required: true })} />
            <Input aria-label="Stock" min="0" placeholder="Stock" type="number" {...register("stock", { required: true })} />
          </div>
          <Input aria-label="Image URL" placeholder="Image URL (optional)" {...register("imageUrl")} />

          {message && <p className="text-[13px] success-text">{message}</p>}
          {errorMessage && <p className="text-[13px] error-text">{errorMessage}</p>}

          <Button disabled={isSubmitting} type="submit" variant="dark">
            {isSubmitting ? "Saving..." : "Save Product"}
          </Button>
        </form>
      </div>
    </section>
  );
}
