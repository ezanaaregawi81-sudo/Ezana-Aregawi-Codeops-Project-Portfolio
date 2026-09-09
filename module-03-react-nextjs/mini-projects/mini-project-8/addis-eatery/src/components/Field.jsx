export default function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  autoComplete,
}) {
  const hasError = Boolean(error);

  return (
    <label className={hasError ? "field field-error" : "field"}>
      <span className={hasError ? "field-label error-label" : "field-label"}>{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
        className={hasError ? "invalid" : ""}
      />
      {hasError && (
        <span id={`${name}-error`} className="error-message">
          {error}
        </span>
      )}
    </label>
  );
}
