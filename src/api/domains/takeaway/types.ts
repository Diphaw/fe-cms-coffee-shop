import { ApiResult, BodyOnlyRequest } from "@/api/configs/types";
import { Order } from "@/types";

export type CreateTakeawayBody = {
  items: { menuItemId: string; quantity: number; notes?: string }[];
  notes?: string;
};
export type CreateTakeawayRequest = BodyOnlyRequest<CreateTakeawayBody>;
export type CreateTakeawayResponse = ApiResult<Order>;
