import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { createKey } from "@/api/configs/keys";
import { ApiError } from "@/api/configs/types";
import { ordersService } from "./service";
import {
  GetOrderListRequest,
  GetOrderListResponse,
  GetOrderDetailRequest,
  GetOrderDetailResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
} from "./types";

export const orderKeys = createKey("orders");

export const useGetOrderList = (
  request?: GetOrderListRequest,
  options?: Partial<UseQueryOptions<GetOrderListResponse, ApiError>>
) => {
  return useQuery({
    queryKey: orderKeys.list(request?.params),
    queryFn: () => ordersService.getOrderList(request),
    ...options,
  });
};

export const useGetOrderDetail = (
  request: GetOrderDetailRequest,
  options?: Partial<UseQueryOptions<GetOrderDetailResponse, ApiError>>
) => {
  return useQuery({
    queryKey: orderKeys.detail(request.path?.id),
    queryFn: () => ordersService.getOrderDetail(request),
    ...options,
  });
};

export const useCreateOrder = (
  options?: Partial<UseMutationOptions<CreateOrderResponse, ApiError, CreateOrderRequest>>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateOrderRequest) => ordersService.createOrder(request),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: orderKeys.all });
      if (options?.onSuccess) {
        await options.onSuccess(...args);
      }
    },
  });
};

export const useUpdateOrderStatus = (
  options?: Partial<
    UseMutationOptions<UpdateOrderStatusResponse, ApiError, UpdateOrderStatusRequest>
  >
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: UpdateOrderStatusRequest) => ordersService.updateOrderStatus(request),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: orderKeys.all });
      const variables = args[1] as UpdateOrderStatusRequest;
      if (variables?.path?.id) {
        await queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.path.id) });
      }
      if (options?.onSuccess) {
        await options.onSuccess(...args);
      }
    },
  });
};
