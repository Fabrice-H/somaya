import type { ReactNode } from "react";

type TabSectionProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function TabSection({ title, description, children }: TabSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[#000000] mb-1">{title}</h2>
        <p className="text-sm text-[#6b6b6b]">{description}</p>
      </div>
      <div className="space-y-5 pt-4">{children}</div>
    </div>
  );
}
