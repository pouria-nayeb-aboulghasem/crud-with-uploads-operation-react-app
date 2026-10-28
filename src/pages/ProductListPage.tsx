import { Link } from "react-router-dom";
import ProductRow from "@/components/ProductRow";
import { useProducts } from "@/hooks/product/useProducts";

function ProductListPage() {
  // step 1: products hook
  const { products, loading, error, refresh } = useProducts();

  return (
    <section>
      <div className="mb-8.75 flex items-start justify-between gap-6 sm:mb-11.75 sm:items-end">
        <div>
          {/* SUBTITLE */}
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[1.55px] text-[#2c6745]">
            Your catalog
          </p>
          {/* TITLE */}
          <h1 className="mb-2.5 text-[29px] font-semibold leading-[1.15] tracking-[-1.5px] text-[#20251f] sm:text-[38px]">
            Products
          </h1>
          {/* DESCRIPTION */}
          <p className="m-0 text-sm leading-relaxed text-[#7c827b]">
            Keep your product information organized and up to date.
          </p>
        </div>

        {/* create page link */}
        <Link
          className="inline-flex min-h-9.25 items-center justify-center gap-2 rounded-[7px] bg-[#2c6745] px-3 text-[11px] font-semibold text-white transition hover:bg-[#205437] sm:min-h-10.5 sm:px-4.25 sm:text-xs"
          to="/products/new"
        >
          <span aria-hidden="true" className="text-base">
            +
          </span>
          <span className="hidden sm:inline">Add product</span>
          <span className="sm:hidden">Add</span>
        </Link>
      </div>

      {/* ERROR: products hook */}
      {error && (
        <div
          className="mb-4 flex items-center justify-between gap-4 rounded-[7px] border border-[#f0d6d2] bg-[#fff8f7] px-3.5 py-3 text-xs text-[#a1473d]"
          role="alert"
        >
          <span>{error}</span>
          {/* reload button */}
          <button
            className="cursor-pointer border-0 bg-transparent text-xs font-semibold whitespace-nowrap text-[#2c6745]"
            onClick={refresh}
            type="button"
          >
            Try again
          </button>
        </div>
      )}

      <div className="flex min-h-12.25 items-start justify-between border-b border-[#e8eae5]">
        {/* COUNT: products */}
        <div className="flex items-center gap-2.25">
          <h2 className="m-0 text-sm font-semibold tracking-[-0.2px]">
            All products
          </h2>
          {!loading && !error && (
            <span className="grid h-5.25 min-w-5.25 place-items-center rounded-xl bg-[#edf2ed] px-1.5 text-[10px] font-bold text-[#53745a]">
              {products.length}
            </span>
          )}
        </div>

        {/* label */}
        <span className="hidden pt-1 text-[9px] font-bold tracking-[1.1px] text-[#a0a59e] sm:inline">
          PRODUCT DETAILS
        </span>
      </div>

      {loading ? (
        // loading
        <div
          className="flex min-h-37.5 items-center justify-center gap-3 rounded-[10px] border border-[#e8eae5] bg-white text-[13px] text-[#7c827b]"
          role="status"
        >
          <span className="size-4.75 animate-spin rounded-full border-2 border-[#e2e9e1] border-t-[#2c6745]" />
          Loading your products…
        </div>
      ) : products.length > 0 ? (
        // list of products
        <div className="divide-y divide-[#e8eae5] border-b border-[#e8eae5]">
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              onDeleted={refresh}
            />
          ))}
        </div>
      ) : !error ? (
        // no products in list
        <div className="mt-4.75 flex min-h-77.5 flex-col items-center justify-center rounded-[10px] border border-[#e8eae5] bg-white px-6 py-9 text-center">
          <div
            className="grid size-12 place-items-center rounded-[14px] bg-[#eff4ef] text-[26px] text-[#2c6745]"
            aria-hidden="true"
          >
            ◇
          </div>
          <h2 className="mb-2 mt-4.5 text-base font-semibold tracking-[-0.3px]">
            Your catalog is ready for its first product
          </h2>
          <p className="mb-5.25 text-[13px] text-[#7c827b]">
            Add a product to start building your catalog.
          </p>
          <Link
            className="inline-flex min-h-10.5 items-center justify-center rounded-[7px] bg-[#2c6745] px-4.25 text-xs font-semibold text-white transition hover:bg-[#205437]"
            to="/products/new"
          >
            Add your first product
          </Link>
        </div>
      ) : null}
    </section>
  );
}

export default ProductListPage;
