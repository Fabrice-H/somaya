"use client";

import { useEffect, useState, useTransition } from "react";
import { EMPTY_TESTIMONIAL_FORM, FEEDBACK_DURATION_MS } from "@/features/testimonials/constants";
import { createTestimonial, deleteTestimonial, updateTestimonial } from "@/features/testimonials/server/actions";
import { toTestimonialFormValues, toTestimonialPayload } from "@/features/testimonials/utils";
import type { TestimonialData, TestimonialFormValues, TestimonialsFeedback } from "@/features/testimonials/types";

export function useTestimonialsManager(initialData: TestimonialData[]) {
  const [testimonials, setTestimonials] = useState(initialData);
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<TestimonialFormValues>(EMPTY_TESTIMONIAL_FORM);
  const [feedback, setFeedback] = useState<TestimonialsFeedback | null>(null);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), FEEDBACK_DURATION_MS);
    return () => clearTimeout(timer);
  }, [feedback]);

  const isFormOpen = isAdding || editingId !== null;

  const updateForm = (updates: Partial<TestimonialFormValues>) => setForm((prev) => ({ ...prev, ...updates }));

  const closeForm = () => {
    setForm(EMPTY_TESTIMONIAL_FORM);
    setEditingId(null);
    setIsAdding(false);
  };

  const startAdd = () => {
    closeForm();
    setIsAdding(true);
  };

  const startEdit = (item: TestimonialData) => {
    setForm(toTestimonialFormValues(item));
    setEditingId(item.id);
    setIsAdding(false);
  };

  const fail = (error?: string) => setFeedback({ type: "error", text: error || "Erreur" });

  const save = () => {
    const payload = toTestimonialPayload(form);
    startTransition(async () => {
      if (editingId) {
        const result = await updateTestimonial(editingId, payload);
        if (!result.success) return fail(result.error);
        setTestimonials((prev) => prev.map((item) => (item.id === editingId ? { ...item, ...payload } : item)));
        setFeedback({ type: "success", text: "Témoignage mis à jour" });
      } else {
        const sortOrder = testimonials.length;
        const result = await createTestimonial({ ...payload, sortOrder });
        if (!result.success || !result.id) return fail(result.error);
        const id = result.id;
        setTestimonials((prev) => [...prev, { id, ...payload, sortOrder }]);
        setFeedback({ type: "success", text: "Témoignage ajouté" });
      }
      closeForm();
    });
  };

  const remove = (id: string) => {
    if (!confirm("Supprimer ce témoignage ?")) return;
    startTransition(async () => {
      const result = await deleteTestimonial(id);
      if (!result.success) return fail(result.error);
      setTestimonials((prev) => prev.filter((item) => item.id !== id));
      if (editingId === id) closeForm();
      setFeedback({ type: "success", text: "Témoignage supprimé" });
    });
  };

  const toggleActive = (item: TestimonialData) => {
    startTransition(async () => {
      const result = await updateTestimonial(item.id, { isActive: !item.isActive });
      if (!result.success) return;
      setTestimonials((prev) =>
        prev.map((entry) => (entry.id === item.id ? { ...entry, isActive: !entry.isActive } : entry))
      );
    });
  };

  return {
    testimonials,
    form,
    feedback,
    isPending,
    isEditing: editingId !== null,
    isFormOpen,
    updateForm,
    closeForm,
    startAdd,
    startEdit,
    save,
    remove,
    toggleActive,
  };
}
