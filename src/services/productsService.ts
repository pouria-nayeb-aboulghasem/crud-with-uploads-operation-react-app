import { API_BASE_URL, API_ENDPOINTS } from "@/constants";
import type { CreateProductDto, Product, UpdateProductDto } from "@/types";
import { handleResponse, isObjectOrArray } from "@/utils";

// helper
function getProductApiUrl(): string {
  return `${API_BASE_URL}/${API_ENDPOINTS.products}`;
}

// helper
function productFormData(
  product: CreateProductDto | UpdateProductDto,
  image?: File,
  images?: File[],
): FormData {
  const formData = new FormData();

  // get input fields data
  for (const key of Object.keys(product) as Array<keyof typeof product>) {
    const value = product[key];

    if (value === undefined) continue;

    formData.append(
      key,
      isObjectOrArray(value) ? JSON.stringify(value) : String(value),
    );
  }

  // upload single image file
  if (image) formData.append("image", image);

  // upload multiple image files
  if (images) images.forEach((file) => formData.append("images", file));

  return formData;
}

// READ: Get all products
async function getProducts(signal?: AbortSignal): Promise<Product[]> {
  const response = await fetch(`${getProductApiUrl()}`, { signal });

  return handleResponse<Product[]>(response);
}

// READ: Get a single product by ID
async function getProduct(id: string, signal?: AbortSignal): Promise<Product> {
  const response = await fetch(`${getProductApiUrl()}/${id}`, { signal });

  return handleResponse<Product>(response);
}

// CREATE: Add a new product
async function createProduct(
  product: CreateProductDto,
  image?: File,
  images?: File[],
): Promise<Product> {
  const response = await fetch(getProductApiUrl(), {
    method: "POST",
    body: productFormData(product, image, images),
  });

  return handleResponse<Product>(response);
}

// UPDATE: Update an existing product
async function updateProduct(
  id: string,
  product: UpdateProductDto,
  image?: File,
  images?: File[],
): Promise<Product> {
  const response = await fetch(`${getProductApiUrl()}/${id}`, {
    method: "PUT",
    body: productFormData(product, image, images),
  });

  return handleResponse<Product>(response);
}

// DELETE: Remove a product
async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`${getProductApiUrl()}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Delete failed: ${response.status} ${response.statusText}`);
  }
}

export { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
