import {
  ApiResult,
  BodyOnlyRequest,
  PathOnlyRequest,
  PathBodyRequest,
  ParamsOnlyRequest,
} from "@/api/configs/types";
import { Order, OrderStatus } from "@/types";

export type GetOrderListParams = {
  status?: string;
  tableId?: string;
};

export type GetOrderListRequest = ParamsOnlyRequest<GetOrderListParams>;
export type GetOrderListResponse = ApiResult<Order[]>;

export type GetOrderDetailRequest = PathOnlyRequest<{ id: string }>;
export type GetOrderDetailResponse = ApiResult<Order>;

export type CreateOrderBody = {
  tableId: string;
  items: { menuItemId: string; quantity: number; notes?: string }[];
  notes?: string;
};
export type CreateOrderRequest = BodyOnlyRequest<CreateOrderBody>;
export type CreateOrderResponse = ApiResult<Order>;

export type UpdateOrderStatusBody = {
  status: OrderStatus;
};
export type UpdateOrderStatusRequest = PathBodyRequest<{ id: string }, UpdateOrderStatusBody>;
export type UpdateOrderStatusResponse = ApiResult<Order>;
