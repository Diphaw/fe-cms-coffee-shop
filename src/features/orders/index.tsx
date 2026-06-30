"use client";

import { useState } from "react";
import { useGetOrderList, useUpdateOrderStatus } from "@/api/domains/orders/query";
import { OrderCard } from "./components/OrderCard";
export { OrderCard };
import { OrderDetailDialog } from "./components/OrderDetailDialog";
import { getColumns } from "./column";
import { EmptyState, DataTable, alert, TitleActions } from "@/components/block";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, Loader2 } from "lucide-react";
import type { OrderStatus, OrderData } from "@/api/domains/orders/types";
import { getErrorMessage } from "@/utils/error";
import { cn } from "@/utils/classname";

import { ACTIVE_STATUSES } from "./constants";

export default function OrdersContent() {
  const [activeFilter, setActiveFilter] = useState<"ACTIVE" | "PAST">("ACTIVE");
  const [detailOrder, setDetailOrder] = useState<OrderData | null>(null);

  const { data: orderListResponse, isLoading } = useGetOrderList();

  const updateStatusMutation = useUpdateOrderStatus({
    onSuccess: () => {
      alert.success({
        title: "Status pesanan diperbarui!",
        description: "Pesanan berhasil diubah ke status baru.",
      });
    },
    onError: (err) => {
      alert.error({
        title: "Gagal memperbarui status",
        description: getErrorMessage(err, "Gagal memperbarui status pesanan."),
      });
    },
  });

  const orders = orderListResponse?.data ?? [];

  const isActiveOrder = (order: OrderData) => ACTIVE_STATUSES.includes(order.status);

  const filteredOrders = orders.filter((order) => {
    const matchesType = order.type === "DINE_IN";
    const matchesFilter = activeFilter === "ACTIVE" ? isActiveOrder(order) : !isActiveOrder(order);
    return matchesType && matchesFilter;
  });

  const activeCount = orders.filter(
    (order) => order.type === "DINE_IN" && isActiveOrder(order)
  ).length;

  const pastCount = orders.filter(
    (order) => order.type === "DINE_IN" && !isActiveOrder(order)
  ).length;

  const handleUpdateStatus = (id: string, newStatus: OrderStatus) => {
    updateStatusMutation.mutate({ path: { id }, body: { status: newStatus } });
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <TitleActions
        title={
          <span className="flex items-center gap-2">
            <ClipboardList className="w-8 h-8 text-[#c8a96e]" /> Kelola Pesanan Dine In
          </span>
        }
        description="Monitor pesanan makan di tempat secara real-time, atur status dapur, dan kelola meja."
      />

      {/* Navigation Filter Tabs */}
      <div className="inline-flex rounded-lg bg-muted p-1 border border-border/50">
        <button
          onClick={() => setActiveFilter("ACTIVE")}
          className={cn(
            "rounded-md px-4 py-1.5 text-sm font-semibold transition-all cursor-pointer",
            activeFilter === "ACTIVE"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Pesanan Aktif ({activeCount})
        </button>
        <button
          onClick={() => setActiveFilter("PAST")}
          className={cn(
            "rounded-md px-4 py-1.5 text-sm font-semibold transition-all cursor-pointer",
            activeFilter === "PAST"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Riwayat Transaksi ({pastCount})
        </button>
      </div>

      {/* Tabel Pesanan */}
      {isLoading ? (
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#c8a96e]" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={activeFilter === "ACTIVE" ? "Tidak ada pesanan aktif" : "Riwayat transaksi kosong"}
          subtitle={
            activeFilter === "ACTIVE"
              ? "Semua pesanan pelanggan telah diselesaikan."
              : "Belum ada transaksi lama terdaftar."
          }
        />
      ) : (
        <Card className="border-border bg-card">
          <CardContent className="p-0">
            <DataTable
              columns={getColumns({
                activeFilter,
                onUpdateStatus: handleUpdateStatus,
                onViewDetail: (order) => setDetailOrder(order),
              })}
              data={filteredOrders}
              loading={isLoading}
              hidePagination
              className="shadow-none border-none bg-transparent rounded-none"
            />
          </CardContent>
        </Card>
      )}

      {/* Dialog Detail Pesanan */}
      <OrderDetailDialog
        order={detailOrder}
        open={detailOrder !== null}
        onOpenChange={(open) => !open && setDetailOrder(null)}
      />
    </div>
  );
}
