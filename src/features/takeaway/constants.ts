import type { OrderStatus } from "@/types";
import type { TakeawayFormValues } from "./schema";

export const ACTIVE_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "SERVED",
];

export const DEFAULT_FORM: TakeawayFormValues = {
  items: [],
  notes: "",
};
