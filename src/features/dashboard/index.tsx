"use client";

import { useGetMenuList } from "@/api/domains/menu/query";
import { useGetTableList } from "@/api/domains/tables/query";
import { useGetOrderList } from "@/api/domains/orders/query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/ui/badge";
import { Coffee, Table2, ClipboardList, DollarSign, ChevronRight } from "lucide-react";
import Link from "next/link";
import { EmptyState, TitleActions } from "@/components/block";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardContent() {
  const { data: menuResponse, isLoading: menuLoading, error: menuError } = useGetMenuList();
  const { data: tableResponse, isLoading: tableLoading, error: tableError } = useGetTableList();
  const { data: orderResponse, isLoading: orderLoading, error: orderError } = useGetOrderList();

  const loading = menuLoading || tableLoading || orderLoading;
  const error = menuError || tableError || orderError;

  if (error) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Gagal memuat data dashboard"
        subtitle="Terjadi kesalahan saat mengambil data. Coba muat ulang halaman."
      />
    );
  }

  const menus = menuResponse?.data ?? [];
  const tables = tableResponse?.data ?? [];
  const orders = orderResponse?.data ?? [];

  const menuCount = menus.length;
  const tableCount = tables.length;
  const recentOrders = orders.slice(0, 5);

  const pendingOrdersCount = orders.filter(
    (o) => o.status === "PENDING" || o.status === "PREPARING"
  ).length;

  const todayRevenue = orders
    .filter((o) => o.paymentStatus === "PAID" && o.status !== "CANCELLED")
    .reduce((sum, o) => sum + parseFloat(o.totalAmount), 0);

  const stats = [
    {
      title: "Total Menu",
      value: menuCount,
      description: "Menu aktif dan terdaftar",
      icon: Coffee,
      color: "text-[#c8a96e]",
    },
    {
      title: "Total Meja",
      value: tableCount,
      description: "Meja pelanggan",
      icon: Table2,
      color: "text-blue-400",
    },
    {
      title: "Pesanan Aktif",
      value: pendingOrdersCount,
      description: "Menunggu / Sedang diproses",
      icon: ClipboardList,
      color: "text-amber-400",
    },
    {
      title: "Total Pendapatan",
      value: `Rp ${todayRevenue.toLocaleString("id-ID")}`,
      description: "Dari pesanan lunas",
      icon: DollarSign,
      color: "text-emerald-400",
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Title */}
      <TitleActions
        title="Dashboard Ringkasan"
        description="Pantau status kedai kopi Anda secara real-time dari satu tempat."
      />

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={`stat-skeleton-${i}`} className="border-border bg-card shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))
          : stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={i}
                  className="border-border bg-card shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      {stat.title}
                    </CardTitle>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold tracking-tight text-foreground">
                      {stat.value}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      {/* Recent Orders Table */}
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-foreground">Pesanan Terbaru</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">5 transaksi terakhir pelanggan</p>
          </div>
          <Link
            href="/orders"
            className="text-xs text-primary hover:underline font-bold flex items-center gap-1 transition-colors duration-150"
          >
            Lihat Semua Pesanan <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="py-3.5 px-4">No. Pesanan</th>
                    <th className="py-3.5 px-4">Meja</th>
                    <th className="py-3.5 px-4">Status Pesanan</th>
                    <th className="py-3.5 px-4">Pembayaran</th>
                    <th className="py-3.5 px-4 text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={`recent-skeleton-${idx}`}>
                      <td className="py-3.5 px-4">
                        <Skeleton className="h-4 w-16" />
                      </td>
                      <td className="py-3.5 px-4">
                        <Skeleton className="h-4 w-12" />
                      </td>
                      <td className="py-3.5 px-4">
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </td>
                      <td className="py-3.5 px-4">
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Skeleton className="h-4 w-20 ml-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Belum ada pesanan terbaru.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="py-3.5 px-4">No. Pesanan</th>
                    <th className="py-3.5 px-4">Meja</th>
                    <th className="py-3.5 px-4">Status Pesanan</th>
                    <th className="py-3.5 px-4">Pembayaran</th>
                    <th className="py-3.5 px-4 text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-accent/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-foreground">
                        {order.orderNumber}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-foreground">
                        {order.table ? `Meja ${order.table.number}` : "-"}
                      </td>
                      <td className="py-3.5 px-4">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="py-3.5 px-4">
                        <PaymentStatusBadge status={order.paymentStatus} />
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-foreground">
                        Rp {parseFloat(order.totalAmount).toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
