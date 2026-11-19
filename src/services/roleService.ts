import request from "./api";
export const roleService = {
  list: () => request<string[]>("/roles"),
  userRoles: (userId: string) =>
    request<string[]>(`/roles/users/${encodeURIComponent(userId)}`),
  create: (name: string) =>
    request<void>(`/roles/${encodeURIComponent(name)}`, { method: "POST" }),
  remove: (name: string) =>
    request<void>(`/roles/${encodeURIComponent(name)}`, { method: "DELETE" }),
  assign: (userId: string, role: string) =>
    request<void>(
      `/roles/users/${encodeURIComponent(userId)}/assign/${encodeURIComponent(role)}`,
      { method: "POST" },
    ),
  unassign: (userId: string, role: string) =>
    request<void>(
      `/roles/users/${encodeURIComponent(userId)}/remove/${encodeURIComponent(role)}`,
      { method: "DELETE" },
    ),
};
