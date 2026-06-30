import { ApiResult, BodyOnlyRequest } from "@/api/configs/types";
import type { OrderData } from "@/api/domains/orders/types";

// ===============================================
// Type Request and Response Container
// ===============================================

export type CreateTakeawayRequest = BodyOnlyRequest<CreateTakeawayBody>;
export type CreateTakeawayResponse = ApiResult<OrderData>;

// ===============================================
// Type Definition Here
// ===============================================

export type CreateTakeawayBody = {
  items: { menuItemId: string; quantity: number; notes?: string }[];
  notes?: string;
};
