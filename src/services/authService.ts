import request from "./api";
import type { AuthResponse, LoginDto, RegisterDto } from "../types/Auth";
export const authService = {
  login: (dto: LoginDto) =>
    request<AuthResponse>("/auth/login", { method: "POST", body: dto }),
  register: (dto: RegisterDto) =>
    request<{ message: string }>("/auth/register", {
      method: "POST",
      body: dto,
    }),
};
