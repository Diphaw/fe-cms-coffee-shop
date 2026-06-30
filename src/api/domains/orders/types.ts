import {
  ApiResult,
  BodyOnlyRequest,
  ParamsOnlyRequest,
  PathBodyRequest,
  PathOnlyRequest,
} from "@/api/configs/types";

// ===============================================
// Type Request and Response Container
// ===============================================

export type GetOrderListRequest = ParamsOnlyRequest<GetOrderListParams>;
export type GetOrderListResponse = ApiResult<OrderData[]>;

export type GetOrderDetailRequest = PathOnlyRequest<{ id: string }>;
export type GetOrderDetailResponse = ApiResult<OrderData>;

export type CreateOrderRequest = BodyOnlyRequest<CreateOrderBody>;
export type CreateOrderResponse = ApiResult<OrderData>;

export type UpdateOrderStatusRequest = PathBodyRequest<{ id: string }, UpdateOrderStatusBody>;
export type UpdateOrderStatusResponse = ApiResult<OrderData>;

// ===============================================
// Type Definition Here
// ===============================================

export type OrderStatus = "PENDING" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";

export type PaymentStatus = "UNPAID" | "PAID" | "REFUNDED";

export type OrderType = "DINE_IN" | "TAKE_AWAY";

export type GetOrderListParams = {
  status?: string;
  tableId?: string;
  page?: number;
  limit?: number;
};

export type CreateOrderBody = {
  tableId: string;
  items: { menuItemId: string; quantity: number; notes?: string }[];
  notes?: string;
};

export type UpdateOrderStatusBody = {
  status: OrderStatus;
};

export type OrderItemData = {
  id: string;
  quantity: number;
  price: string;
  notes: string | null;
  menuItem: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
};

export type OrderData = {
  id: string;
  orderNumber: string;
  type: OrderType;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: string;
  notes: string | null;
  tableId: string | null;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
  table: { id: string; number: number } | null;
  user: { id: string; name: string; email: string } | null;
  orderItems: OrderItemData[];
};
