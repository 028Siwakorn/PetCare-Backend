/**
 * Input - ช่องกรอกข้อมูล ใช้ซ้ำได้
 */
export default function Input({
  label,
  error,
  type = "text",
  className = "",
  inputClassName = "",
  ...props
}) {
  return (
    <div className={`form-control w-full max-w-full ${className}`}>
      {label && (
        <label className="label">
          <span className="label-text font-medium">{label}</span>
        </label>
      )}
      <input
        type={type}
        className={`input input-bordered w-full ${error ? "input-error" : ""} ${inputClassName}`}
        {...props}
      />
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
}
