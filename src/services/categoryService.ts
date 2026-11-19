import request from "./api";
import type { Category } from "../types/Category";
export interface CategoryInput {
  name: string;
  description?: string | null;
}
export const categoryService = {
  list: () => request<Category[]>("/categories"),
  get: (id: number) => request<Category>(`/categories/${id}`),
  create: (dto: CategoryInput) =>
    request<Category>("/categories", { method: "POST", body: dto }),
  update: (id: number, dto: CategoryInput) =>
    request<void>(`/categories/${id}`, { method: "PUT", body: dto }),
  remove: (id: number) =>
    request<void>(`/categories/${id}`, { method: "DELETE" }),
};
