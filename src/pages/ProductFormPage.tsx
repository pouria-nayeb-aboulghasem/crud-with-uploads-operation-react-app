import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useCreateProduct } from "@/hooks/product/useCreateProduct";
import { useProduct } from "@/hooks/product/useProduct";
import { useUpdateProduct } from "@/hooks/product/useUpdateProduct";
import type { UpdateProductDto } from "@/types";

type ProductFormValues = UpdateProductDto & {
  image?: FileList;
  images?: FileList;
};

function ProductFormPage() {
  // step 2: get url params from url
  const { id } = useParams();

  // step 3: check id availability and toggle between create and update
  const editing = Boolean(id);

  // step 4: product hook api (UPDATE only)
  const {
    product,
    loading: productLoading,
    error: productError,
  } = useProduct(id);

  // step 5: create hook api
  const {
    create,
    loading: createLoading,
    error: createError,
  } = useCreateProduct();

  // step 5: update hook api
  const {
    update,
    loading: updateLoading,
    error: updateError,
  } = useUpdateProduct(id ?? "");

  // step 6: react-hook-form api
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: { name: "", price: "", imageUrl: "", imageUrls: [] },
  });

  // step 7: redirect to homepage
  const navigate = useNavigate();

  // step 8: fill form inputs (UPDATE only)
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        imageUrls: product.imageUrls ?? [],
      });
    }
  }, [product, reset]);

  // step 9: submit form for create | update product
  async function onSubmit(values: ProductFormValues) {
    const { image, images, ...productData } = values;
    const imageFile = image?.[0];
    const imageFiles = images ? Array.from(images) : undefined;

    const saved = editing
      ? await update(productData, imageFile, imageFiles)
      : await create(
          { ...productData, createdAt: new Date().toISOString() },
          imageFile,
          imageFiles,
        );

    if (saved) {
      navigate("/");
    }
  }

  // UPDATE & LOADING
  if (editing && productLoading) {
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

  // UPDATE & ERROR
  if (editing && (productError || !product)) {
    return (
      <div
        className="mb-4 flex items-center justify-between gap-4 rounded-[7px] border border-[#f0d6d2] bg-[#fff8f7] px-3.5 py-3 text-xs text-[#a1473d]"
        role="alert"
      >
        {productError ?? "Product not found."}
        <Link className="text-xs font-semibold text-[#2c6745]" to="/">
          Back to products
        </Link>
      </div>
    );
  }

  // ERROR: create or update
  const mutationError = createError ?? updateError;
  // LOADING
  const saving = createLoading || updateLoading;

  // step 10: implement form and inputs
  return (
    <section className="mx-auto max-w-170">
      {/* UPDATE: back to product detail | CREATE: back to home */}
      <Link
        className="mb-7.5 inline-flex items-center gap-2 text-xs font-semibold text-[#71776f] hover:text-[#2c6745]"
        to={editing && id ? `/products/${id}` : "/"}
      >
        <span aria-hidden="true">←</span>
        {editing ? "Product details" : "All products"}
      </Link>

      <div className="mb-7">
        <div>
          {/* SUBTITLE: edit or create */}
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[1.55px] text-[#2c6745]">
            {editing ? "Edit product" : "New product"}
          </p>
          {/* TITLE: edit or create */}
          <h1 className="mb-2.5 text-[30px] font-semibold leading-[1.15] tracking-[-1.5px] text-[#20251f] sm:text-[32px]">
            {editing ? "Update your product" : "Add a product"}
          </h1>
          {/* DESCRIPTION: edit or create */}
          <p className="m-0 text-sm leading-relaxed text-[#7c827b]">
            {editing
              ? "Make changes to the details in your catalog."
              : "Add the essential details to your product catalog."}
          </p>
        </div>
      </div>

      <form
        className="rounded-[10px] border border-[#e8eae5] bg-white px-5 py-6 sm:px-8 sm:pb-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Error: create or update */}
        {mutationError && (
          <div
            className="mb-4 flex items-center justify-between gap-4 rounded-[7px] border border-[#f0d6d2] bg-[#fff8f7] px-3.5 py-3 text-xs text-[#a1473d]"
            role="alert"
          >
            {mutationError}
          </div>
        )}

        {/* UI: static data */}
        <div className="mb-6.75 flex items-start gap-3.25">
          <span className="grid size-7.25 flex-none place-items-center rounded-lg bg-[#edf3ed] text-[10px] font-bold text-[#2c6745]">
            01
          </span>
          <div>
            <h2 className="mb-1.25 mt-px text-sm font-semibold">
              Product information
            </h2>
            <p className="m-0 text-[11px] text-[#7c827b]">
              These details will appear in your catalog.
            </p>
          </div>
        </div>

        {/* INPUT: product name */}
        <label className="mb-5.5 flex flex-col gap-2 text-[11px] font-semibold text-[#373d36]">
          <span>
            Product name <span className="text-[#bd5a4d]">*</span>
          </span>
          <input
            autoComplete="off"
            className="h-10.75 w-full rounded-md border border-[#dfe3dc] bg-white px-3 text-xs font-normal text-[#20241f] placeholder:text-[#b2b7b0] focus:border-[#7ca98b] focus:outline-none focus:ring-[3px] focus:ring-[#e7f0e8]"
            placeholder="e.g. Everyday Carry Backpack"
            {...register("name", {
              required: "Product name is required.",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters.",
              },
              maxLength: {
                value: 120,
                message: "Name must be 120 characters or less.",
              },
            })}
          />
          {errors.name && (
            <span className="text-[10px] font-medium text-[#b14c40]">
              {errors.name.message}
            </span>
          )}
        </label>

        {/* INPUT: product price */}
        <label className="mb-5.5 flex flex-col gap-2 text-[11px] font-semibold text-[#373d36]">
          <span>
            Price <span className="text-[#bd5a4d]">*</span>
          </span>
          <div className="relative">
            <span
              aria-hidden="true"
              className="absolute left-3.25 top-1/2 -translate-y-1/2 text-[13px] font-medium text-[#92988f]"
            >
              $
            </span>
            <input
              className="h-10.75 w-full rounded-md border border-[#dfe3dc] bg-white pl-7.25 pr-3 text-xs font-normal text-[#20241f] placeholder:text-[#b2b7b0] focus:border-[#7ca98b] focus:outline-none focus:ring-[3px] focus:ring-[#e7f0e8]"
              inputMode="decimal"
              placeholder="0.00"
              {...register("price", {
                required: "Price is required.",
                validate: (value) =>
                  (Number.isFinite(Number(value)) && Number(value) > 0) ||
                  "Enter a price greater than zero.",
              })}
            />
          </div>
          {errors.price && (
            <span className="text-[10px] font-medium text-[#b14c40]">
              {errors.price.message}
            </span>
          )}
        </label>

        {/* INPUT: single product image upload */}
        <label className="mb-5.5 flex flex-col gap-2 text-[11px] font-semibold text-[#373d36]">
          <span>Upload one image</span>
          <input
            accept="image/*"
            className="w-full rounded-md border border-[#dfe3dc] bg-white px-3 py-2 text-xs font-normal text-[#20241f] file:mr-3 file:rounded file:border-0 file:bg-[#edf3ed] file:px-3 file:py-1.5 file:text-[11px] file:font-semibold file:text-[#2c6745]"
            type="file"
            {...register("image", {
              validate: (files) =>
                !files?.length ||
                Array.from(files).every((file) =>
                  file.type.startsWith("image/"),
                ) ||
                "Select an image file.",
            })}
          />
          {errors.image && (
            <span className="text-[10px] font-medium text-[#b14c40]">
              {errors.image.message}
            </span>
          )}
          <span className="-mt-0.5 text-[10px] font-normal text-[#92988f]">
            Choose a single image file.
          </span>
        </label>

        {/* INPUT: multiple product image upload */}
        <label className="mb-5.5 flex flex-col gap-2 text-[11px] font-semibold text-[#373d36]">
          <span>Upload multiple images</span>
          <input
            accept="image/*"
            className="w-full rounded-md border border-[#dfe3dc] bg-white px-3 py-2 text-xs font-normal text-[#20241f] file:mr-3 file:rounded file:border-0 file:bg-[#edf3ed] file:px-3 file:py-1.5 file:text-[11px] file:font-semibold file:text-[#2c6745]"
            multiple
            type="file"
            {...register("images", {
              validate: (files) =>
                !files?.length ||
                Array.from(files).every((file) =>
                  file.type.startsWith("image/"),
                ) ||
                "Select image files only.",
            })}
          />
          {errors.images && (
            <span className="text-[10px] font-medium text-[#b14c40]">
              {errors.images.message}
            </span>
          )}
          <span className="-mt-0.5 text-[10px] font-normal text-[#92988f]">
            Choose one or more image files.
          </span>
        </label>

        <div className="mt-7.5 flex justify-end gap-2.25 border-t border-[#eff0ed] pt-5.25">
          {/* back to home */}
          <Link
            className="inline-flex min-h-10.5 items-center justify-center rounded-[7px] border border-[#dfe3dc] bg-white px-4 text-xs font-semibold text-[#454a44] transition hover:bg-[#f7f8f5]"
            to="/"
          >
            Cancel
          </Link>

          {/* submit form */}
          <button
            className="inline-flex min-h-10.5 items-center justify-center gap-2 rounded-[7px] bg-[#2c6745] px-4.25 text-xs font-semibold text-white transition hover:bg-[#205437] disabled:cursor-wait disabled:opacity-60"
            disabled={saving}
            type="submit"
          >
            {saving && (
              <span className="size-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {saving ? "Saving…" : editing ? "Save changes" : "Create product"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default ProductFormPage;
