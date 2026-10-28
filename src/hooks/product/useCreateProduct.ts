import { useState } from "react";
import { createProduct } from "@/services";
import type { CreateProductDto } from "@/types";

function useCreateProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(
    data: CreateProductDto,
    image?: File,
    images?: File[],
  ): Promise<boolean> {
    setLoading(true);

    try {
      await createProduct(data, image, images);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { create, loading, error };
}

export { useCreateProduct };
