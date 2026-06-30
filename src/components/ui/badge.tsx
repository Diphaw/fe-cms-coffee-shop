// ─── Badge ────────────────────────────────────────────────────────────────────

type BadgeVariant = "green" | "red" | "yellow" | "blue" | "gray" | "gold";

const BADGE_STYLES: Record<BadgeVariant, { bg: string; color: string }> = {
  green: { bg: "rgba(16,185,129,0.15)", color: "#6ee7b7" },
  red: { bg: "rgba(239,68,68,0.15)", color: "#fca5a5" },
  yellow: { bg: "rgba(245,158,11,0.15)", color: "#fcd34d" },
  blue: { bg: "rgba(59,130,246,0.15)", color: "#93c5fd" },
  gray: { bg: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" },
  gold: { bg: "rgba(200,169,110,0.15)", color: "#c8a96e" },
};

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
};

export function Badge({ children, variant = "gray" }: BadgeProps) {
  const { bg, color } = BADGE_STYLES[variant];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: bg,
        color,
        fontSize: 11,
        fontWeight: 700,
        padding: "3px 10px",
        borderRadius: 999,
        whiteSpace: "nowrap",
        letterSpacing: "0.02em",
      }}
    >
      {children}
    </span>
  );
}

// ─── Domain-specific badge helpers ───────────────────────────────────────────

import type { TableStatus } from "@/api/domains/tables/types";
import type { OrderStatus, PaymentStatus, OrderType } from "@/api/domains/orders/types";

export function TableStatusBadge({ status }: { status: TableStatus }) {
  const map: Record<TableStatus, { variant: BadgeVariant; label: string }> = {
    AVAILABLE: { variant: "green", label: "Tersedia" },
    OCCUPIED: { variant: "red", label: "Terisi" },
    RESERVED: { variant: "yellow", label: "Reservasi" },
  };
  const { variant, label } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, { variant: BadgeVariant; label: string }> = {
    PENDING: { variant: "yellow", label: "Menunggu" },
    PREPARING: { variant: "gold", label: "Diproses" },
    READY: { variant: "green", label: "Siap" },
    COMPLETED: { variant: "green", label: "Selesai" },
    CANCELLED: { variant: "red", label: "Dibatalkan" },
  };
  const { variant, label } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const map: Record<PaymentStatus, { variant: BadgeVariant; label: string }> = {
    UNPAID: { variant: "red", label: "Belum Bayar" },
    PAID: { variant: "green", label: "Lunas" },
    REFUNDED: { variant: "yellow", label: "Refund" },
  };
  const { variant, label } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function OrderTypeBadge({ type }: { type: OrderType }) {
  const map: Record<OrderType, { variant: BadgeVariant; label: string }> = {
    DINE_IN: { variant: "gold", label: "Dine In" },
    TAKE_AWAY: { variant: "blue", label: "Takeaway" },
  };
  const { variant, label } = map[type];
  return <Badge variant={variant}>{label}</Badge>;
}
