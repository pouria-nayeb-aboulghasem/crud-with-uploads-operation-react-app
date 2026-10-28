import { useEffect, useState } from "react";
import type { Product } from "@/types";
import { getProducts } from "@/services";

function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        setLoading(true);

        const data = await getProducts(controller.signal);

        setProducts(data);
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
  }, [refreshKey]);

  function refresh() {
    setRefreshKey((key) => key + 1);
  }

  return { products, loading, error, refresh };
}

export { useProducts };
