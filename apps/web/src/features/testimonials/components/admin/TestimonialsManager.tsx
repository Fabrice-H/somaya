"use client";

import clsx from "clsx";
import { useTestimonialsManager } from "@/features/testimonials/hooks/useTestimonialsManager";
import { TestimonialForm } from "./TestimonialForm";
import { TestimonialListItem } from "./TestimonialListItem";
import { TestimonialsEmptyState } from "./TestimonialsEmptyState";
import { TestimonialsManagerHeader } from "./TestimonialsManagerHeader";
import type { TestimonialData } from "@/features/testimonials/types";

type TestimonialsManagerProps = {
  initialData: TestimonialData[];
};

export function TestimonialsManager({ initialData }: TestimonialsManagerProps) {
  const manager = useTestimonialsManager(initialData);

  const content = (
    <div className={clsx("grid items-start gap-6", manager.isFormOpen && "lg:grid-cols-[minmax(0,420px)_1fr]")}>
      {manager.isFormOpen && (
        <TestimonialForm
          values={manager.form}
          isEditing={manager.isEditing}
          isPending={manager.isPending}
          onChange={manager.updateForm}
          onSave={manager.save}
          onClose={manager.closeForm}
        />
      )}

      {manager.testimonials.length === 0 ? (
        <TestimonialsEmptyState onAdd={manager.startAdd} />
      ) : (
        <div
          className={clsx(
            "grid gap-4",
            manager.isFormOpen ? "md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-3"
          )}
        >
          {manager.testimonials.map((item) => (
            <TestimonialListItem
              key={item.id}
              item={item}
              onToggleActive={() => manager.toggleActive(item)}
              onEdit={() => manager.startEdit(item)}
              onDelete={() => manager.remove(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <TestimonialsManagerHeader feedback={manager.feedback} onAdd={manager.startAdd} />
      <div className="p-4">{content}</div>
    </div>
  );
}
