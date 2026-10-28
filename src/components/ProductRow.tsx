import { useState } from "react";
import { Link } from "react-router-dom";
import { useDeleteProduct } from "@/hooks/product/useDeleteProduct";
import type { Product } from "@/types";

type ProductRowProps = {
  product: Product;
  onDeleted: () => void;
};

function ProductRow({ product, onDeleted }: ProductRowProps) {
  // step 1: delete product hook
  const { remove, loading, error } = useDeleteProduct(product.id);
  // step 2: health/broken image
  const [imageFailed, setImageFailed] = useState(false);

  async function handleDelete() {
    // deletion confirm popup
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      return;
    }

    // remove product from server
    await remove();
    // refresh list of products
    onDeleted();
  }

  return (
    <article className="relative flex min-h-23 flex-wrap items-center gap-x-2.75 gap-y-2 py-3 sm:flex-nowrap sm:gap-4.25 sm:py-0">
      {/* LINK: product details */}
      <Link
        aria-label={`View ${product.name}`}
        className="grid size-11.75 flex-none place-items-center overflow-hidden rounded-lg border border-[#eceee9] bg-[#f7f8f5] sm:size-14"
        to={`/products/${product.id}`}
      >
        {product.imageUrl && !imageFailed ? (
          // healthy image
          <img
            alt={product.name}
            className="size-full object-cover"
            onError={() => setImageFailed(true)}
            src={product.imageUrl}
          />
        ) : (
          // broken image
          <span className="text-[25px] text-[#b5c2b5]" aria-hidden="true">
            ◇
          </span>
        )}
      </Link>
      <Link
        className="flex min-w-0 flex-1 flex-col gap-1.5 sm:w-auto"
        to={`/products/${product.id}`}
      >
        <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-semibold text-[#292e29]">
          {product.name}
        </span>
        {/* PRODUCT: date */}
        <span className="text-[11px] text-[#969b94]">
          Added{" "}
          {product.createdAt
            ? new Date(product.createdAt).toLocaleDateString()
            : "recently"}
        </span>
      </Link>
      {/* PRODUCT: price */}
      <span className="ml-14.5 whitespace-nowrap text-xs font-semibold text-[#333a32] sm:ml-0 sm:text-[13px]">
        ${Number(product.price).toFixed(2)}
      </span>
      <div className="ml-auto flex items-center gap-0 sm:ml-3 sm:gap-1.5">
        {/* LINK: edit product */}
        <Link
          aria-label={`Edit ${product.name}`}
          className="grid size-7.75 place-items-center rounded-[7px] text-[#777e76] transition hover:bg-white hover:text-[#2c6745] sm:size-8.5"
          title="Edit product"
          to={`/products/${product.id}/edit`}
        >
          <svg
            aria-hidden="true"
            fill="none"
            height="18"
            viewBox="0 0 24 24"
            width="18"
          >
            <path
              d="m16 4 4 4M4 20l4.5-1 11-11a2.12 2.12 0 0 0-3-3l-11 11L4 20Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.7"
            />
          </svg>
        </Link>
        {/* delete button */}
        <button
          aria-label={`Delete ${product.name}`}
          className="grid size-7.75 place-items-center rounded-[7px] text-[#777e76] transition hover:bg-white hover:text-[#b14c40] disabled:cursor-wait disabled:opacity-60 sm:size-8.5"
          disabled={loading}
          onClick={handleDelete}
          title="Delete product"
          type="button"
        >
          {loading ? (
            <span className="size-3.5 animate-spin rounded-full border-2 border-[#e2e9e1] border-t-[#2c6745]" />
          ) : (
            <svg
              aria-hidden="true"
              fill="none"
              height="18"
              viewBox="0 0 24 24"
              width="18"
            >
              <path
                d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.7"
              />
            </svg>
          )}
        </button>
      </div>
      {error && (
        <p
          className="absolute bottom-0 right-0 m-0 text-[10px] text-[#b14c40]"
          role="alert"
        >
          Delete failed: {error}
        </p>
      )}
    </article>
  );
}

export default ProductRow;
