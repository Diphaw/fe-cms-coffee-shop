import { ApiResult, BodyOnlyRequest } from "@/api/configs/types";
import { User } from "@/types";

export type LoginBody = {
  email: string;
  password: string;
};

export type LoginRequest = BodyOnlyRequest<LoginBody>;
export type LoginResponse = ApiResult<{
  user: User;
  token: string;
}>;
export type MeResponse = ApiResult<User>;
