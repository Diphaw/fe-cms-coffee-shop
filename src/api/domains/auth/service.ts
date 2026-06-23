import { baseApi } from "@/api/configs/url";
import { LoginRequest, LoginResponse, MeResponse } from "./types";

class AuthService {
  async login(request: LoginRequest): Promise<LoginResponse> {
    return await baseApi.post("/auth/login", request.body);
  }

  async me(): Promise<MeResponse> {
    return await baseApi.get("/auth/me");
  }
}

export const authService = new AuthService();
