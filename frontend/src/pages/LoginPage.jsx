// ─── LoginPage.jsx ────────────────────────────────────────────────────────────
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ mode: "onChange", reValidateMode: "onChange" });

  const onSubmit = async (values) => {
    setErrorMessage("");
    try {
      const response = await api.post("/auth/login", values);
      localStorage.setItem("userId", response.data.userId);
      navigate("/");
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <section className="volt-auth-wrapper">
      <div className="volt-auth-card">
        <div className="volt-auth-brand">
          <span className="volt-brand-mark">⚡</span>
          <span className="volt-brand-name">VOLT</span>
        </div>
        <div className="volt-auth-heading">
          <div className="volt-label">WELCOME BACK</div>
          <h1 className="volt-auth-title">Sign In</h1>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="volt-field-label">EMAIL</label>
            <input className="volt-input" placeholder="you@example.com" {...register("email", { required: "Email is required" })} />
            {errors.email && <p className="volt-field-error">{errors.email.message}</p>}
          </div>
          <div>
            <label className="volt-field-label">PASSWORD</label>
            <input className="volt-input" placeholder="••••••••" type="password" {...register("password", { required: "Password is required" })} />
            {errors.password && <p className="volt-field-error">{errors.password.message}</p>}
          </div>

          {errorMessage && (
            <div className="font-mono text-[12px] text-[var(--volt-danger)] bg-[var(--volt-danger-bg)] border border-[var(--volt-danger)] px-3 py-2">
              ERR: {errorMessage}
            </div>
          )}

          <button className="volt-btn-primary w-full mt-2" disabled={isSubmitting} type="submit">
            {isSubmitting ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>

        <p className="volt-auth-footer">
          New here?{" "}
          <Link className="volt-auth-link" to="/signup">Create account →</Link>
        </p>
      </div>
    </section>
  );
}