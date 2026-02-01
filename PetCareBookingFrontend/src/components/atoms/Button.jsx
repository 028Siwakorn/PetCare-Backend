/**
 * Reusable Button - Atomic Component
 * @param {string} variant - 'primary' | 'secondary' | 'outline' | 'ghost' | 'error'
 * @param {string} size - 'xs' | 'sm' | 'md' | 'lg'
 * @param {boolean} fullWidth - stretch on mobile
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  type = "button",
  className = "",
  ...props
}) {
  const base = "btn font-medium transition-all active:scale-[0.98]";
  const variants = {
    primary: "btn-primary text-primary-content",
    secondary: "btn-secondary text-secondary-content",
    outline: "btn-outline",
    ghost: "btn-ghost",
    error: "btn-error text-error-content",
    success: "btn-success text-success-content",
  };
  const sizes = {
    xs: "btn-xs",
    sm: "btn-sm",
    md: "btn-md",
    lg: "btn-lg",
  };
  const width = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${base} ${variants[variant] ?? variants.primary} ${sizes[size]} ${width} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <span className="loading loading-spinner loading-sm" />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
}
