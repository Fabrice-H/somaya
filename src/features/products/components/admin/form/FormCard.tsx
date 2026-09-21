import type { ReactNode } from "react";

interface FormCardProps {
  title: string;
  children: ReactNode;
}

export function FormCard({ title, children }: FormCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-medium text-[#3c161e] mb-4">{title}</h3>
      {children}
    </div>
  );
}
