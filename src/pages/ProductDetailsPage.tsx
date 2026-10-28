import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDeleteProduct } from "@/hooks/product/useDeleteProduct";
import { useProduct } from "@/hooks/product/useProduct";

function ProductDetailsPage() {
  // step 1: get url params from url
  const { id = "" } = useParams();
  // step 2: product hook api
  const { product, loading, error } = useProduct(id);
  // step 3: delete hook api
  const {
    remove,
    loading: deleting,
    error: deleteError,
  } = useDeleteProduct(id);
  // step 4: healthy or broken image
  const [imageFailed, setImageFailed] = useState(false);
  // step 5: redirect to homepage
  const navigate = useNavigate();

  async function handleDelete() {
    // confirm delete popup
    if (
      !product ||
      !window.confirm(`Delete "${product.name}"? This cannot be undone.`)
    ) {
      return;
    }

    await remove();
    navigate("/");
  }

  if (loading) {
    // loading: before product load
    return (
      <div
        className="flex min-h-37.5 items-center justify-center gap-3 rounded-[10px] border border-[#e8eae5] bg-white text-[13px] text-[#7c827b]"
        role="status"
      >
        <span className="size-4.75 animate-spin rounded-full border-2 border-[#e2e9e1] border-t-[#2c6745]" />
        Loading product…
      </div>
    );
  }

  if (error || !product) {
    // ERROR: failed to load product info
    return (
      <div
        className="mb-4 flex items-center justify-between gap-4 rounded-[7px] border border-[#f0d6d2] bg-[#fff8f7] px-3.5 py-3 text-xs text-[#a1473d]"
        role="alert"
      >
        {error ?? "Product not found."}
        <Link className="text-xs font-semibold text-[#2c6745]" to="/">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-170">
      {/* back to home */}
      <Link
        className="mb-7.5 inline-flex items-center gap-2 text-xs font-semibold text-[#71776f] hover:text-[#2c6745]"
        to="/"
      >
        <span aria-hidden="true">←</span> All products
      </Link>
      {/* ERROR: delete operation failed */}
      {deleteError && (
        <div
          className="mb-4 flex items-center justify-between gap-4 rounded-[7px] border border-[#f0d6d2] bg-[#fff8f7] px-3.5 py-3 text-xs text-[#a1473d]"
          role="alert"
        >
          Delete failed: {deleteError}
        </div>
      )}

      <article className="grid overflow-hidden rounded-[10px] border border-[#e8eae5] bg-white md:grid-cols-[minmax(220px,0.9fr)_1.1fr]">
        {/* PRODUCT:img */}
        <figure className="grid min-h-65 max-h-82.5 place-items-center overflow-hidden bg-[#f0f2ed] sm:min-h-75sm:max-h-none md:min-h-95">
          {product.imageUrl && !imageFailed ? (
            // healthy image
            <img
              alt={product.name}
              className="size-full min-h-65 object-cover sm:min-h-75 md:min-h-95"
              onError={() => setImageFailed(true)}
              src={product.imageUrl}
            />
          ) : (
            // not available image
            <span className="text-[68px] text-[#b8c5b9]" aria-hidden="true">
              ◇
            </span>
          )}
        </figure>

        <div className="p-6.5 sm:p-[34px_30px]">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[1.55px] text-[#2c6745]">
            Product details
          </p>
          {/* PRODUCT:name */}
          <h1 className="mb-2.5 wrap-anywhere text-[27px] font-semibold leading-[1.15] tracking-[-1.2px] text-[#20251f]">
            {product.name}
          </h1>
          {/* PRODUCT:price */}
          <p className="mb-5.75 mt-3.5 text-xl font-bold text-[#2c6745]">
            ${Number(product.price).toFixed(2)}
          </p>
          <div className="h-px bg-[#e8eae5]" />
          <dl className="my-5.5 grid gap-4.5">
            {/* PRODUCT:id */}
            <div className="grid gap-1.5">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.4px] text-[#92988f]">
                Product ID
              </dt>
              <dd className="m-0 wrap-anywhere text-xs text-[#3d433d]">
                {product.id}
              </dd>
            </div>

            {/* PRODUCT:date */}
            <div className="grid gap-1.5">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.4px] text-[#92988f]">
                Added to catalog
              </dt>
              <dd className="m-0 text-xs text-[#3d433d]">
                {product.createdAt
                  ? new Date(product.createdAt).toLocaleDateString()
                  : "Not available"}
              </dd>
            </div>

            {/* PRODUCT:img url */}
            {product.imageUrl && (
              <div className="grid gap-1.5">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.4px] text-[#92988f]">
                  Image URL
                </dt>
                <dd className="m-0 wrap-anywhere text-[10px] text-[#2c6745]">
                  {product.imageUrl}
                </dd>
              </div>
            )}
          </dl>
          <div className="mt-6.25 flex items-center gap-2.25">
            {/* edit link */}
            <Link
              className="inline-flex min-h-10.5 items-center justify-center rounded-[7px] bg-[#2c6745] px-4.25 text-xs font-semibold text-white transition hover:bg-[#205437]"
              to={`/products/${product.id}/edit`}
            >
              Edit product
            </Link>
            {/* delete button */}
            <button
              className="inline-flex min-h-10.5 items-center justify-center rounded-[7px] border border-[#f0d6d2] bg-white px-4 text-xs font-semibold text-[#ad4b40] transition hover:bg-[#fff6f5] disabled:cursor-wait disabled:opacity-60"
              disabled={deleting}
              onClick={handleDelete}
              type="button"
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </article>
    </section>
  );
}

export default ProductDetailsPage;
