import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { createKey } from "@/api/configs/keys";
import { ApiError } from "@/api/configs/types";
import { tablesService } from "./service";
import {
  GetTableListRequest,
  GetTableListResponse,
  GetTableDetailRequest,
  GetTableDetailResponse,
  CreateTableRequest,
  CreateTableResponse,
  UpdateTableRequest,
  UpdateTableResponse,
  DeleteTableRequest,
  DeleteTableResponse,
} from "./types";

export const tableKeys = createKey("tables");

export const useGetTableList = (
  request?: GetTableListRequest,
  options?: Partial<UseQueryOptions<GetTableListResponse, ApiError>>
) => {
  return useQuery({
    queryKey: tableKeys.list(request?.params),
    queryFn: () => tablesService.getTableList(request),
    ...options,
  });
};

export const useGetTableDetail = (
  request: GetTableDetailRequest,
  options?: Partial<UseQueryOptions<GetTableDetailResponse, ApiError>>
) => {
  return useQuery({
    queryKey: tableKeys.detail(request.path?.id),
    queryFn: () => tablesService.getTableDetail(request),
    ...options,
  });
};

export const useCreateTable = (
  options?: Partial<UseMutationOptions<CreateTableResponse, ApiError, CreateTableRequest>>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateTableRequest) => tablesService.createTable(request),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: tableKeys.all });
      if (options?.onSuccess) {
        await options.onSuccess(...args);
      }
    },
  });
};

export const useUpdateTable = (
  options?: Partial<UseMutationOptions<UpdateTableResponse, ApiError, UpdateTableRequest>>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: UpdateTableRequest) => tablesService.updateTable(request),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: tableKeys.all });
      const variables = args[1] as UpdateTableRequest;
      if (variables?.path?.id) {
        await queryClient.invalidateQueries({ queryKey: tableKeys.detail(variables.path.id) });
      }
      if (options?.onSuccess) {
        await options.onSuccess(...args);
      }
    },
  });
};

export const useDeleteTable = (
  options?: Partial<UseMutationOptions<DeleteTableResponse, ApiError, DeleteTableRequest>>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: DeleteTableRequest) => tablesService.deleteTable(request),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: tableKeys.all });
      if (options?.onSuccess) {
        await options.onSuccess(...args);
      }
    },
  });
};
