import { useEffect, useState } from "react";
import type { Product } from "@/types";
import { getProduct } from "@/services";

function useProduct(id?: string) {
  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      if (!id) {
        setProduct(undefined);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const data = await getProduct(id, controller.signal);

        setProduct(data);
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error ? err.message : "Failed to fetch products",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      controller.abort();
    };
  }, [id]);

  return { product, loading, error };
}

export { useProduct };
