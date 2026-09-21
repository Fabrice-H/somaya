type FieldProps = {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
};

export function Field({ id, label, required, hint, error, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="label-som">
        {label}
        {required && <span className="text-[var(--som-primary)]"> *</span>}
      </label>
      {children}
      {error ? (
        <p role="alert" className="error-som m-0">
          {error}
        </p>
      ) : (
        hint && <p className="help-som m-0">{hint}</p>
      )}
    </div>
  );
}
