"use client";

import { useState } from "react";
import { useGetOrderList, useUpdateOrderStatus } from "@/api/domains/orders/query";
import { AddTakeawayDialog } from "./components/AddTakeawayDialog";
import { OrderDetailDialog } from "@/features/orders/components/OrderDetailDialog";
import { getColumns } from "@/features/orders/column";
import { EmptyState, DataTable, alert, TitleActions } from "@/components/block";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Plus, Loader2 } from "lucide-react";
import type { OrderStatus, OrderData } from "@/api/domains/orders/types";
import { getErrorMessage } from "@/utils/error";
import { cn } from "@/utils/classname";

import { ACTIVE_STATUSES } from "./constants";

export default function TakeawayContent() {
  const [activeFilter, setActiveFilter] = useState<"ACTIVE" | "PAST">("ACTIVE");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [detailOrder, setDetailOrder] = useState<OrderData | null>(null);

  const { data: orderListResponse, isLoading } = useGetOrderList();

  const updateStatusMutation = useUpdateOrderStatus({
    onSuccess: () => {
      alert.success({
        title: "Status pesanan diperbarui!",
        description: "Pesanan takeaway berhasil diubah ke status baru.",
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
    const matchesType = order.type === "TAKE_AWAY";
    const matchesFilter = activeFilter === "ACTIVE" ? isActiveOrder(order) : !isActiveOrder(order);
    return matchesType && matchesFilter;
  });

  const activeCount = orders.filter(
    (order) => order.type === "TAKE_AWAY" && isActiveOrder(order)
  ).length;

  const pastCount = orders.filter(
    (order) => order.type === "TAKE_AWAY" && !isActiveOrder(order)
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
            <ShoppingBag className="w-8 h-8 text-[#c8a96e]" /> Kelola Pesanan Takeaway
          </span>
        }
        description="Monitor pesanan bawa pulang secara real-time, pantau persiapan dapur, dan saji takeaway."
        actions={
          <Button
            size="sm"
            onClick={() => setAddDialogOpen(true)}
            className="font-bold cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Tambah Pesanan
          </Button>
        }
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

      {/* Tabel Pesanan Takeaway */}
      {isLoading ? (
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#c8a96e]" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title={activeFilter === "ACTIVE" ? "Tidak ada pesanan aktif" : "Riwayat transaksi kosong"}
          subtitle={
            activeFilter === "ACTIVE"
              ? "Semua pesanan takeaway pelanggan telah diselesaikan."
              : "Belum ada transaksi takeaway lama terdaftar."
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

      {/* Dialog: Add Takeaway Order */}
      <AddTakeawayDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={() => {}}
      />

      {/* Dialog Detail Pesanan */}
      <OrderDetailDialog
        order={detailOrder}
        open={detailOrder !== null}
        onOpenChange={(open) => !open && setDetailOrder(null)}
      />
    </div>
  );
}
