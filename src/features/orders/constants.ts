import type { OrderStatus } from "@/api/domains/orders/types";

export const ACTIVE_STATUSES: OrderStatus[] = ["PENDING", "PREPARING", "READY"];
