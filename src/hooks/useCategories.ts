import { useEffect, useState } from "react";
import { categoryService } from "../services/categoryService";
import type { Category } from "../types/Category";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    categoryService
      .list()
      .then((data) => {
        if (active) setCategories(data);
      })
      .catch((err: unknown) => {
        if (active)
          setError(
            err instanceof Error ? err.message : "Unable to load categories.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { categories, loading, error };
}
