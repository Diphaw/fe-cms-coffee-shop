import { baseApi } from "@/api/configs/url";
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

class OrdersService {
  async getOrderList(request?: GetOrderListRequest): Promise<GetOrderListResponse> {
    return await baseApi.get("/orders", { params: request?.params });
  }

  async getOrderDetail(request: GetOrderDetailRequest): Promise<GetOrderDetailResponse> {
    return await baseApi.get(`/orders/${request.path?.id}`);
  }

  async createOrder(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    return await baseApi.post("/orders", request.body);
  }

  async updateOrderStatus(request: UpdateOrderStatusRequest): Promise<UpdateOrderStatusResponse> {
    return await baseApi.patch(`/orders/${request.path?.id}/status`, request.body);
  }
}

export const ordersService = new OrdersService();
