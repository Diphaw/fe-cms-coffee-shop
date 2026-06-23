import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { createKey } from "@/api/configs/keys";
import { ApiError } from "@/api/configs/types";
import { menuService } from "./service";
import {
  GetMenuListRequest,
  GetMenuListResponse,
  GetMenuDetailRequest,
  GetMenuDetailResponse,
  CreateMenuRequest,
  CreateMenuResponse,
  UpdateMenuRequest,
  UpdateMenuResponse,
  ToggleMenuRequest,
  ToggleMenuResponse,
  DeleteMenuRequest,
  DeleteMenuResponse,
} from "./types";

export const menuKeys = createKey("menu");

export const useGetMenuList = (
  request?: GetMenuListRequest,
  options?: Partial<UseQueryOptions<GetMenuListResponse, ApiError>>
) => {
  return useQuery({
    queryKey: menuKeys.list(request?.params),
    queryFn: () => menuService.getMenuList(request),
    ...options,
  });
};

export const useGetMenuDetail = (
  request: GetMenuDetailRequest,
  options?: Partial<UseQueryOptions<GetMenuDetailResponse, ApiError>>
) => {
  return useQuery({
    queryKey: menuKeys.detail(request.path?.id),
    queryFn: () => menuService.getMenuDetail(request),
    ...options,
  });
};

export const useCreateMenu = (
  options?: Partial<UseMutationOptions<CreateMenuResponse, ApiError, CreateMenuRequest>>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateMenuRequest) => menuService.createMenu(request),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: menuKeys.all });
      if (options?.onSuccess) {
        await options.onSuccess(...args);
      }
    },
  });
};

export const useUpdateMenu = (
  options?: Partial<UseMutationOptions<UpdateMenuResponse, ApiError, UpdateMenuRequest>>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: UpdateMenuRequest) => menuService.updateMenu(request),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: menuKeys.all });
      const variables = args[1] as UpdateMenuRequest;
      if (variables?.path?.id) {
        await queryClient.invalidateQueries({ queryKey: menuKeys.detail(variables.path.id) });
      }
      if (options?.onSuccess) {
        await options.onSuccess(...args);
      }
    },
  });
};

export const useToggleMenu = (
  options?: Partial<UseMutationOptions<ToggleMenuResponse, ApiError, ToggleMenuRequest>>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: ToggleMenuRequest) => menuService.toggleMenu(request),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: menuKeys.all });
      const variables = args[1] as ToggleMenuRequest;
      if (variables?.path?.id) {
        await queryClient.invalidateQueries({ queryKey: menuKeys.detail(variables.path.id) });
      }
      if (options?.onSuccess) {
        await options.onSuccess(...args);
      }
    },
  });
};

export const useDeleteMenu = (
  options?: Partial<UseMutationOptions<DeleteMenuResponse, ApiError, DeleteMenuRequest>>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: DeleteMenuRequest) => menuService.deleteMenu(request),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: menuKeys.all });
      if (options?.onSuccess) {
        await options.onSuccess(...args);
      }
    },
  });
};
