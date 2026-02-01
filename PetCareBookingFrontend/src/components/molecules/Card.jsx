/**
 * Reusable Card - Molecule
 * Mobile-first: stacks content, touch-friendly
 */
export default function Card({ children, className = "", noPadding = false }) {
  return (
    <div
      className={`card bg-base-100 shadow-xl border border-base-200 overflow-hidden ${noPadding ? "" : "p-4 sm:p-5"} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardBody({ children, className = "" }) {
  return <div className={`card-body p-0 gap-2 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }) {
  return <h3 className={`card-title text-base sm:text-lg ${className}`}>{children}</h3>;
}

export function CardActions({ children, className = "" }) {
  return <div className={`card-actions justify-end mt-2 ${className}`}>{children}</div>;
}
