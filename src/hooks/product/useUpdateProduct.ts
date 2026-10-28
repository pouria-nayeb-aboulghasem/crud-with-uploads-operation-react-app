import { useState } from "react";
import { updateProduct } from "@/services";
import type { UpdateProductDto } from "@/types";

function useUpdateProduct(id: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function update(
    data: UpdateProductDto,
    image?: File,
    images?: File[],
  ): Promise<boolean> {
    setLoading(true);

    try {
      await updateProduct(id, data, image, images);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update product");
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { update, loading, error };
}

export { useUpdateProduct };
