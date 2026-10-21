"use client";

import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { DEFAULT_PRODUCT_INPUT } from "../constants";
import { toProductInput } from "../utils";
import type { Product, ProductInput } from "../types";

interface ProductFormState {
  form: ProductInput;
  isDirty: boolean;
  isSubmitting: boolean;
  error: string | null;
  setField: <K extends keyof ProductInput>(key: K, value: ProductInput[K]) => void;
  initialize: (product?: Product) => void;
  setSubmitting: (submitting: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProductFormStore = create<ProductFormState>((set) => ({
  form: DEFAULT_PRODUCT_INPUT,
  isDirty: false,
  isSubmitting: false,
  error: null,
  setField: (key, value) => set((state) => ({ form: { ...state.form, [key]: value }, isDirty: true })),
  initialize: (product) =>
    set({
      form: product ? toProductInput(product) : DEFAULT_PRODUCT_INPUT,
      isDirty: false,
      isSubmitting: false,
      error: null,
    }),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  setError: (error) => set({ error }),
}));

export const useProductFormImages = () => useProductFormStore((state) => state.form.images);

export const useProductFormStatus = () =>
  useProductFormStore(
    useShallow((state) => ({
      is_active: state.form.is_active,
      is_new: state.form.is_new,
      is_featured: state.form.is_featured,
    }))
  );

export const useProductFormMeta = () =>
  useProductFormStore(
    useShallow((state) => ({
      isDirty: state.isDirty,
      isSubmitting: state.isSubmitting,
      error: state.error,
    }))
  );
