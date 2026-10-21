type CheckoutFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string[];
  hint?: string;
  children: (props: { id: string; "aria-invalid": boolean; "aria-describedby"?: string }) => React.ReactNode;
};

export function CheckoutField({ id, label, required, error, hint, children }: CheckoutFieldProps) {
  const message = error?.[0];
  const describedBy = message ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div>
      <label htmlFor={id} className="label-som">
        {label}
        {required && <span className="text-[var(--som-primary)]"> *</span>}
      </label>
      {children({ id, "aria-invalid": Boolean(message), "aria-describedby": describedBy })}
      {message ? (
        <p id={`${id}-error`} role="alert" className="error-som m-0">
          {message}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="help-som m-0">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
