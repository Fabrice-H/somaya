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
  embedded?: boolean;
};

export function TestimonialsManager({ initialData, embedded = false }: TestimonialsManagerProps) {
  const manager = useTestimonialsManager(initialData);

  return (
    <div>
      <TestimonialsManagerHeader embedded={embedded} feedback={manager.feedback} onAdd={manager.startAdd} />

      <div style={{ padding: embedded ? "16px" : "32px 40px" }}>
        <div className="grid lg:grid-cols-2 gap-6" style={{ maxWidth: 1200 }}>
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

          <div className={clsx("space-y-3", !manager.isFormOpen && "lg:col-span-2")}>
            {manager.testimonials.length === 0 ? (
              <TestimonialsEmptyState onAdd={manager.startAdd} />
            ) : (
              <div className={clsx("grid gap-4", !manager.isFormOpen && "md:grid-cols-2 lg:grid-cols-3")}>
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
        </div>
      </div>
    </div>
  );
}
