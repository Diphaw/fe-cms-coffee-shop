import type { OrderData, OrderStatus } from "@/api/domains/orders/types";

export interface OrderCardProps {
  order: OrderData;
  activeFilter: "ACTIVE" | "PAST";
  onUpdateStatus: (id: string, status: OrderStatus) => void;
}
