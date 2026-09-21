"use client";

import { useCallback, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_PRODUCTS_PATH } from "../constants";
import { productSchema } from "../schemas";
import { createProduct, updateProduct } from "../server/actions";
import { useProductFormStore } from "../stores/product-form-store";

export function useProductSubmit(productId?: string) {
  const router = useRouter();

  return useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      const { form, setError, setSubmitting } = useProductFormStore.getState();
      setError(null);

      const parsed = productSchema.safeParse(form);
      if (!parsed.success) {
        setError(parsed.error.issues[0].message);
        return;
      }

      setSubmitting(true);
      try {
        const result = productId ? await updateProduct(productId, parsed.data) : await createProduct(parsed.data);
        if (!result.success) {
          setError(result.error);
          return;
        }
        router.push(ADMIN_PRODUCTS_PATH);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Une erreur est survenue");
      } finally {
        setSubmitting(false);
      }
    },
    [productId, router]
  );
}
