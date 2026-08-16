"use client";

import { memo } from "react";
import Image from "next/image";
import { formatPriceXOF } from "@/lib/utils";
import { ProductActions } from "./ProductActions";
import type { Product } from "../../types";
import clsx from "clsx";

interface ProductRowProps {
  product: Product;
  isLoading: boolean;
  onToggle: (id: string, isActive: boolean) => Promise<void>;
  onDelete: (id: string, name: string) => Promise<void>;
}

export const ProductRow = memo(
  function ProductRow({
    product,
    isLoading,
    onToggle,
    onDelete,
  }: ProductRowProps) {
    return (
      <tr
        className={clsx(
          "hover:bg-[#faf6f1]/50 transition-colors",
          isLoading && "opacity-50"
        )}
      >
        {/* Product Info */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                width={40}
                height={40}
                className="w-10 h-10 object-cover rounded-lg"
              />
            ) : (
              <div className="w-10 h-10 bg-[#511F29]/10 rounded-lg flex items-center justify-center">
                <span className="text-[#511F29]/30 text-xs">N/A</span>
              </div>
            )}
            <div>
              <p className="font-medium text-[#511F29]">{product.name}</p>
              {product.sku && (
                <span className="text-xs text-[#511F29]/60">
                  SKU: {product.sku}
                </span>
              )}
            </div>
          </div>
        </td>

        {/* Category */}
        <td className="px-4 py-3 text-sm text-[#511F29]/70">
          {product.category?.name || "-"}
        </td>

        {/* Price */}
        <td className="px-4 py-3">
          <p className="text-sm font-medium text-[#511F29]">
            {formatPriceXOF(product.price)}
          </p>
          {product.old_price && (
            <p className="text-xs text-[#511F29]/50 line-through">
              {formatPriceXOF(product.old_price)}
            </p>
          )}
        </td>

        {/* Stock */}
        <td className="px-4 py-3">
          <span
            className={clsx(
              "text-sm",
              product.stock <= product.low_stock_threshold
                ? "text-red-600 font-medium"
                : "text-[#511F29]/70"
            )}
          >
            {product.stock}
          </span>
          {product.stock <= product.low_stock_threshold && (
            <span className="ml-1 text-xs text-red-500">(faible)</span>
          )}
        </td>

        {/* Status */}
        <td className="px-4 py-3">
          <span
            className={clsx(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
              product.is_active
                ? "bg-emerald-100 text-emerald-700"
                : "bg-gray-100 text-gray-600"
            )}
          >
            {product.is_active ? "Actif" : "Inactif"}
          </span>
        </td>

        {/* Actions */}
        <td className="px-4 py-3">
          <ProductActions
            productId={product.id}
            productName={product.name}
            isActive={product.is_active}
            isLoading={isLoading}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        </td>
      </tr>
    );
  },
  // Custom comparison to avoid unnecessary re-renders
  (prevProps, nextProps) => {
    return (
      prevProps.product.id === nextProps.product.id &&
      prevProps.product.updated_at === nextProps.product.updated_at &&
      prevProps.product.is_active === nextProps.product.is_active &&
      prevProps.product.stock === nextProps.product.stock &&
      prevProps.isLoading === nextProps.isLoading
    );
  }
);
