"use client";

import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import type { ProductInput, Product } from "../types";

const defaultProductInput: ProductInput = {
  name: "",
  slug: "",
  description: null,
  price: 0,
  old_price: null,
  category_id: null,
  images: [],
  colors: [],
  sizes: [],
  material: null,
  stock: 0,
  low_stock_threshold: 5,
  sku: null,
  is_active: true,
  is_featured: false,
  is_new: false,
  is_bestseller: false,
  sort_order: 0,
};

interface ProductFormState {
  // Form data
  form: ProductInput;
  setField: <K extends keyof ProductInput>(key: K, value: ProductInput[K]) => void;
  setForm: (form: Partial<ProductInput>) => void;
  resetForm: () => void;
  initializeFromProduct: (product: Product) => void;

  // Images pending deletion (for cleanup if form is abandoned)
  pendingDeletes: string[];
  addPendingDelete: (url: string) => void;
  clearPendingDeletes: () => void;

  // Newly uploaded images (for cleanup if form is abandoned)
  newlyUploaded: string[];
  addNewlyUploaded: (url: string) => void;
  removeNewlyUploaded: (url: string) => void;
  clearNewlyUploaded: () => void;

  // Form state
  isDirty: boolean;
  setDirty: (dirty: boolean) => void;
  isSubmitting: boolean;
  setSubmitting: (submitting: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const useProductFormStore = create<ProductFormState>((set) => ({
  // Form data
  form: defaultProductInput,

  setField: (key, value) =>
    set((state) => ({
      form: { ...state.form, [key]: value },
      isDirty: true,
    })),

  setForm: (updates) =>
    set((state) => ({
      form: { ...state.form, ...updates },
      isDirty: true,
    })),

  resetForm: () =>
    set({
      form: defaultProductInput,
      isDirty: false,
      error: null,
      pendingDeletes: [],
      newlyUploaded: [],
    }),

  initializeFromProduct: (product) => {
    set({
      form: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        old_price: product.old_price,
        category_id: product.category_id,
        images: product.images,
        colors: product.colors,
        sizes: product.sizes,
        material: product.material,
        stock: product.stock,
        low_stock_threshold: product.low_stock_threshold,
        sku: product.sku,
        is_active: product.is_active,
        is_featured: product.is_featured,
        is_new: product.is_new,
        is_bestseller: product.is_bestseller,
        sort_order: product.sort_order,
      },
      isDirty: false,
      error: null,
      pendingDeletes: [],
      newlyUploaded: [],
    });
  },

  // Pending deletes
  pendingDeletes: [],
  addPendingDelete: (url) =>
    set((state) => ({
      pendingDeletes: [...state.pendingDeletes, url],
    })),
  clearPendingDeletes: () => set({ pendingDeletes: [] }),

  // Newly uploaded
  newlyUploaded: [],
  addNewlyUploaded: (url) =>
    set((state) => ({
      newlyUploaded: [...state.newlyUploaded, url],
    })),
  removeNewlyUploaded: (url) =>
    set((state) => ({
      newlyUploaded: state.newlyUploaded.filter((u) => u !== url),
    })),
  clearNewlyUploaded: () => set({ newlyUploaded: [] }),

  // Form state
  isDirty: false,
  setDirty: (dirty) => set({ isDirty: dirty }),
  isSubmitting: false,
  setSubmitting: (submitting) => set({ isSubmitting: submitting }),
  error: null,
  setError: (error) => set({ error }),
}));

// Selectors for granular subscriptions (avoid re-renders)
export const useProductFormField = <K extends keyof ProductInput>(key: K) =>
  useProductFormStore((state) => state.form[key]);

export const useProductFormImages = () =>
  useProductFormStore((state) => state.form.images);

export const useProductFormColors = () =>
  useProductFormStore((state) => state.form.colors);

export const useProductFormSizes = () =>
  useProductFormStore((state) => state.form.sizes);

export const useProductFormStatus = () =>
  useProductFormStore(
    useShallow((state) => ({
      is_active: state.form.is_active,
      is_new: state.form.is_new,
      is_bestseller: state.form.is_bestseller,
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
