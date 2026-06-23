import { LayoutDashboard, Coffee, Table2, ClipboardList, ShoppingBag } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/tables", icon: Table2, label: "Daftar Meja" },
  { href: "/menu-items", icon: Coffee, label: "Kelola Menu" },
  { href: "/orders", icon: ClipboardList, label: "Pesanan Dine In" },
  { href: "/takeaway", icon: ShoppingBag, label: "Pesanan Takeaway" },
];
