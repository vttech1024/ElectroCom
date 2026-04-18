import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export default function SignupPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ mode: "onChange", reValidateMode: "onChange" });

  const onSubmit = async (values) => {
    setErrorMessage("");
    try {
      const response = await api.post("/auth/signup", values);
      localStorage.setItem("userId", response.data.userId);
      navigate("/");
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <section className="mx-auto max-w-lg">
      <div className="surface-card rounded-[32px] p-8">
        <p className="eyebrow">Get started</p>
        <h1 className="section-heading mt-2">Create your account</h1>
        <p className="mt-2 text-[15px] text-[var(--olive-gray)]">Join as buyer or seller and start using the marketplace.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input aria-label="Full name" placeholder="Full name" {...register("name", { required: "Name is required" })} />
            {errors.name && <p className="mt-1 text-[13px] error-text">{errors.name.message}</p>}
          </div>

          <div>
            <Input aria-label="Email" placeholder="Email" {...register("email", { required: "Email is required" })} />
            {errors.email && <p className="mt-1 text-[13px] error-text">{errors.email.message}</p>}
          </div>

          <div>
            <Input
              aria-label="Password"
              placeholder="Password"
              type="password"
              {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
            />
            {errors.password && <p className="mt-1 text-[13px] error-text">{errors.password.message}</p>}
          </div>

          {errorMessage && <p className="text-[13px] error-text">{errorMessage}</p>}

          <Button className="w-full !py-3" disabled={isSubmitting} type="submit" variant="dark">
            {isSubmitting ? "Creating..." : "Create account"}
          </Button>
        </form>

        <p className="mt-4 text-[14px] text-[var(--olive-gray)]">
          Already have an account?{" "}
          <Link className="font-medium text-[var(--dark-warm)] underline underline-offset-4 hover:text-[var(--terracotta)]" to="/login">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
