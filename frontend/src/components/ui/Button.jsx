export function Button({ variant = "primary", className = "", type = "button", ...props }) {
  const base = "btn";
  const variants = {
    primary: "btn-primary",
    ghost: "btn-light",
    dark: "btn-dark",
    sand: "btn-sand"
  };

  return <button className={`${base} ${variants[variant] || variants.primary} ${className}`.trim()} type={type} {...props} />;
}
