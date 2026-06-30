import type { OrderStatus } from "@/api/domains/orders/types";
import type { TakeawayFormValues } from "./schema";

export const ACTIVE_STATUSES: OrderStatus[] = ["PENDING", "PREPARING", "READY"];

export const DEFAULT_FORM: TakeawayFormValues = {
  items: [],
  notes: "",
};
