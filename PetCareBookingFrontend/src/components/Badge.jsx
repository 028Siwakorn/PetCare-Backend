/**
 * Badge - แสดงสถานะ (pending, confirmed, completed, cancelled)
 */
export default function Badge({ children, status, className = "" }) {
  const statusStyles = {
    pending: "badge-warning",
    confirmed: "badge-info",
    completed: "badge-success",
    cancelled: "badge-error",
  };
  const style = status ? statusStyles[status] ?? "badge-ghost" : "badge-ghost";

  return <span className={`badge ${style} ${className}`}>{children}</span>;
}
