import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import { ApiError } from "@/api/configs/types";
import { authService } from "./service";
import { LoginRequest, LoginResponse, MeResponse } from "./types";

export const useLogin = (
  options?: Partial<UseMutationOptions<LoginResponse, ApiError, LoginRequest>>
) => {
  return useMutation({
    mutationFn: (request: LoginRequest) => authService.login(request),
    ...options,
  });
};

export const useMe = (options?: Partial<UseQueryOptions<MeResponse, ApiError, MeResponse>>) => {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => authService.me(),
    ...options,
  });
};
