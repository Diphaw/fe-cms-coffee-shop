"use client";

import { useState } from "react";
import { useGetOrderList, useUpdateOrderStatus } from "@/api/domains/orders/query";
import { OrderCard } from "@/features/orders";
import { AddTakeawayDialog } from "./components/AddTakeawayDialog";
import { SuccessModal, ErrorModal, EmptyState } from "@/components/block";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Plus } from "lucide-react";
import type { OrderStatus, Order } from "@/types";
import { getErrorMessage } from "@/utils/error";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { ACTIVE_STATUSES } from "./constants";

export default function TakeawayContent() {
  const [activeFilter, setActiveFilter] = useState<"ACTIVE" | "PAST">("ACTIVE");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState<{
    open: boolean;
    variant: "success" | "error";
    title: string;
    description?: string;
  }>({
    open: false,
    variant: "success",
    title: "",
    description: "",
  });

  const {
    data: orderListResponse,
    isLoading,
    error,
    refetch,
  } = useGetOrderList(undefined, {
    refetchInterval: 15000,
  });

  const updateStatusMutation = useUpdateOrderStatus({
    onSuccess: () => {
      setFeedback({
        open: true,
        variant: "success",
        title: "Status pesanan diperbarui!",
        description: "Pesanan takeaway berhasil diubah ke status baru.",
      });
      void refetch();
    },
    onError: (err) => {
      setFeedback({
        open: true,
        variant: "error",
        title: "Gagal memperbarui status",
        description: getErrorMessage(err, "Gagal memperbarui status pesanan."),
      });
    },
  });

  if (error) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Gagal memuat pesanan takeaway"
        subtitle="Terjadi kesalahan saat mengambil data. Coba muat ulang halaman."
      />
    );
  }

  const orders = orderListResponse?.data ?? [];
  const isActiveOrder = (order: Order) => ACTIVE_STATUSES.includes(order.status);

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <ShoppingBag className="w-8 h-8 text-[#c8a96e]" /> Kelola Pesanan Takeaway
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Monitor pesanan bawa pulang secara real-time, pantau persiapan dapur, dan saji takeaway.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            size="sm"
            onClick={() => setAddDialogOpen(true)}
            className="font-bold cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Tambah Pesanan
          </Button>
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="flex gap-2 border-b border-border pb-1">
        <button
          onClick={() => setActiveFilter("ACTIVE")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeFilter === "ACTIVE"
              ? "border-[#c8a96e] text-[#c8a96e]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Pesanan Aktif ({activeCount})
        </button>
        <button
          onClick={() => setActiveFilter("PAST")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeFilter === "PAST"
              ? "border-[#c8a96e] text-[#c8a96e]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Riwayat Transaksi ({pastCount})
        </button>
      </div>

      {/* Order Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Card
              key={`takeaway-skeleton-${idx}`}
              className="border-border bg-card overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div>
                <CardHeader className="flex flex-row items-start justify-between pb-3 border-b border-border bg-accent/10">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between items-center">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </CardContent>
              </div>
              <div className="p-5 border-t border-border bg-accent/5 flex justify-end gap-2">
                <Skeleton className="h-8 w-24" />
              </div>
            </Card>
          ))}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              activeFilter={activeFilter}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}

      {/* Dialog: Add Takeaway Order */}
      <AddTakeawayDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={() => void refetch()}
      />

      {/* Modal: Success / Error Feedback */}
      <SuccessModal
        open={feedback.open && feedback.variant === "success"}
        onClose={() => setFeedback((prev) => ({ ...prev, open: false }))}
        title={feedback.title}
        description={feedback.description}
      />
      <ErrorModal
        open={feedback.open && feedback.variant === "error"}
        onClose={() => setFeedback((prev) => ({ ...prev, open: false }))}
        title={feedback.title}
        description={feedback.description}
      />
    </div>
  );
}
