import { authService } from "@/api/domains/auth/service";
import { menuService } from "@/api/domains/menu/service";
import { tablesService } from "@/api/domains/tables/service";
import { ordersService } from "@/api/domains/orders/service";
import { takeawayService } from "@/api/domains/takeaway/service";
import type { OrderStatus } from "@/types";

export { auth } from "./auth";

export const api = {
  // Auth
  auth: {
    login: async (email: string, password: string) => {
      const res = await authService.login({ body: { email, password } });
      return res.data;
    },
    me: async () => {
      const res = await authService.me();
      return res.data;
    },
  },

  // Menu
  menu: {
    list: async (params?: { category?: string; available?: boolean; search?: string }) => {
      const res = await menuService.getMenuList({ params });
      return res.data;
    },
    getById: async (id: string) => {
      const res = await menuService.getMenuDetail({ path: { id } });
      return res.data;
    },
    create: async (dto: import("@/types").CreateMenuItemDto) => {
      const res = await menuService.createMenu({ body: dto });
      return res.data;
    },
    update: async (id: string, dto: import("@/types").UpdateMenuItemDto) => {
      const res = await menuService.updateMenu({ path: { id }, body: dto });
      return res.data;
    },
    toggle: async (id: string) => {
      const res = await menuService.toggleMenu({ path: { id } });
      return res.data;
    },
    delete: async (id: string) => {
      const res = await menuService.deleteMenu({ path: { id } });
      return res.data;
    },
  },

  // Tables
  tables: {
    list: async () => {
      const res = await tablesService.getTableList();
      return res.data;
    },
    getById: async (id: string) => {
      const res = await tablesService.getTableDetail({ path: { id } });
      return res.data;
    },
    create: async (dto: { number: number; capacity?: number }) => {
      const res = await tablesService.createTable({ body: dto });
      return res.data;
    },
    update: async (id: string, dto: { number?: number; capacity?: number }) => {
      const res = await tablesService.updateTable({ path: { id }, body: dto });
      return res.data;
    },
    delete: async (id: string) => {
      const res = await tablesService.deleteTable({ path: { id } });
      return res.data;
    },
  },

  // Orders
  orders: {
    list: async (params?: { status?: string; tableId?: string }) => {
      const res = await ordersService.getOrderList({ params });
      return res.data;
    },
    getById: async (id: string) => {
      const res = await ordersService.getOrderDetail({ path: { id } });
      return res.data;
    },
    create: async (dto: {
      tableId: string;
      items: { menuItemId: string; quantity: number; notes?: string }[];
      notes?: string;
    }) => {
      const res = await ordersService.createOrder({ body: dto });
      return res.data;
    },
    updateStatus: async (id: string, status: OrderStatus) => {
      const res = await ordersService.updateOrderStatus({ path: { id }, body: { status } });
      return res.data;
    },
  },

  // Takeaway
  takeaway: {
    create: async (dto: {
      items: { menuItemId: string; quantity: number; notes?: string }[];
      notes?: string;
    }) => {
      const res = await takeawayService.createTakeaway({ body: dto });
      return res.data;
    },
  },
};
