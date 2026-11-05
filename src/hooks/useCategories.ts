import { useEffect, useState } from "react";
import { categoryService } from "../services/categoryService";
import type { Category } from "../types/Category";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      try {
        const data = await categoryService.list();

        if (active) {
          setCategories(data);
        }
      } catch (error) {
        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load categories."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadCategories();

    return () => {
      active = false;
    };
  }, []);

  return { categories, loading, error };
}
