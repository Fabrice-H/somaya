import { Calendar } from "lucide-react";

interface DateFilterInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function DateFilterInput({ label, value, onChange }: DateFilterInputProps) {
  return (
    <div className="relative">
      <Calendar
        size={16}
        style={{
          position: "absolute",
          left: 14,
          top: "50%",
          transform: "translateY(-50%)",
          color: "#6b6b6b",
          pointerEvents: "none",
        }}
      />
      <input
        type="date"
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{
          height: 44,
          paddingLeft: 40,
          paddingRight: 14,
          border: "1px solid rgba(81,31,41,0.15)",
          background: "white",
          fontSize: 13,
          width: 160,
          cursor: "pointer",
          color: "#000000",
        }}
      />
    </div>
  );
}
