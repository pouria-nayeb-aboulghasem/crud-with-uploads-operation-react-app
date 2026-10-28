import { useState } from "react";
import { deleteProduct } from "@/services";

function useDeleteProduct(id: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove(): Promise<void> {
    setLoading(true);

    try {
      await deleteProduct(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove product");
    } finally {
      setLoading(false);
    }
  }

  return { remove, loading, error };
}

export { useDeleteProduct };
