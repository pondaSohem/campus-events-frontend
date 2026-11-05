import request from "./api";
import type { Category } from "../types/Category";

export const categoryService = {
  list: () => request<Category[]>("/categories"),
};
