import { ApiResult, BodyOnlyRequest } from "@/api/configs/types";

// ===============================================
// Type Request and Response Container
// ===============================================

export type LoginRequest = BodyOnlyRequest<LoginBody>;
export type LoginResponse = ApiResult<LoginData>;

export type MeResponse = ApiResult<UserData>;

// ===============================================
// Type Definition Here
// ===============================================

export type Role = "ADMIN" | "CASHIER" | "CUSTOMER";

export type LoginBody = {
  email: string;
  password: string;
};

export type LoginData = {
  user: UserData;
  token: string;
};

export type UserData = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
};
