import { forwardRef } from "react";

export const Input = forwardRef(function Input({ className = "", ...props }, ref) {
  return <input className={`input-control ${className}`.trim()} ref={ref} {...props} />;
});
