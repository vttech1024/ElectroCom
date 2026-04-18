export function Badge({ variant = "default", className = "", ...props }) {
  const base = "badge";
  const variants = {
    default: "badge-soft",
    error: "badge-accent"
  };

  return <span className={`${base} ${variants[variant] || variants.default} ${className}`.trim()} {...props} />;
}
