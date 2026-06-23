import type { Order, OrderStatus } from "@/types";

export interface OrderCardProps {
  order: Order;
  activeFilter: "ACTIVE" | "PAST";
  onUpdateStatus: (id: string, status: OrderStatus) => void;
}
