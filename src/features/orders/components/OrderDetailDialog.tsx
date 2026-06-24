"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/ui/badge";
import { Clock, Calendar, MessageSquare, Receipt, Coffee, ShoppingBag } from "lucide-react";
import type { Order } from "@/types";

interface OrderDetailDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailDialog({ order, open, onOpenChange }: OrderDetailDialogProps) {
  if (!order) return null;

  const dateObj = new Date(order.createdAt);
  const formattedDate = dateObj.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = dateObj.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-[500px] border border-border/80">
        <DialogHeader className="border-b border-border/60 pb-3">
          <div className="flex items-center justify-between gap-4 mt-2">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#c8a96e]" />
              <DialogTitle className="text-lg font-bold text-foreground">
                Detail Pesanan #{order.orderNumber}
              </DialogTitle>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <OrderStatusBadge status={order.status} />
            </div>
          </div>
          <DialogDescription className="text-xs text-muted-foreground flex flex-col gap-1 mt-2">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 shrink-0 text-muted-foreground/70" /> {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 shrink-0 text-muted-foreground/70" /> {formattedTime}{" "}
              WIB
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* Info Box */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-muted/40 rounded-lg border border-border/40 text-xs">
          <div>
            <span className="text-muted-foreground block mb-0.5">Tipe Pesanan</span>
            <div className="flex items-center gap-1.5">
              {order.type === "DINE_IN" ? (
                <span className="font-semibold text-foreground flex items-center gap-1">
                  <Coffee className="w-3.5 h-3.5 text-primary" /> Dine In (Meja{" "}
                  {order.table?.number || "?"})
                </span>
              ) : (
                <span className="font-semibold text-foreground flex items-center gap-1">
                  <ShoppingBag className="w-3.5 h-3.5 text-primary" /> Takeaway
                </span>
              )}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground block mb-0.5">Status Pembayaran</span>
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
        </div>

        {/* Order Items List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Daftar Hidangan
          </h3>
          <div className="divide-y divide-border/40 max-h-[220px] overflow-y-auto pr-1">
            {order.orderItems.map((item) => {
              const priceNum = parseFloat(item.price);
              const subtotal = priceNum * item.quantity;
              return (
                <div
                  key={item.id}
                  className="py-2.5 flex justify-between items-start gap-4 first:pt-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center bg-primary/5 dark:bg-primary/20 text-primary dark:text-primary-foreground font-extrabold text-xs px-2 py-0.5 rounded-md min-w-[24px]">
                        {item.quantity}x
                      </span>
                      <span className="font-semibold text-foreground text-sm">
                        {item.menuItem.name}
                      </span>
                    </div>
                    {item.notes && (
                      <div className="mt-1 flex items-center gap-1 text-xs text-amber-500 font-medium bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10 w-fit">
                        <MessageSquare className="w-3 h-3 text-amber-500 shrink-0" />
                        <span>{item.notes}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-semibold text-foreground block">
                      Rp {subtotal.toLocaleString("id-ID")}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      @ Rp {priceNum.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Customer overall order notes */}
        {order.notes && (
          <div className="p-3 bg-amber-500/5 border-l-3 border-amber-500 rounded-r-lg">
            <h4 className="text-xs font-bold text-amber-600 flex items-center gap-1.5 mb-1">
              <MessageSquare className="w-3.5 h-3.5 shrink-0" /> Catatan Pesanan
            </h4>
            <p className="text-xs text-foreground/90 leading-relaxed font-medium">{order.notes}</p>
          </div>
        )}

        {/* Pricing Summary */}
        <div className="border-t border-border/80 pt-3 mt-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-foreground">Total Tagihan</span>
            <span className="text-lg font-black text-[#c8a96e] font-mono">
              Rp {parseFloat(order.totalAmount).toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto font-bold cursor-pointer"
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
