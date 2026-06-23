export type {
  ApiResult,
  ApiResultWithPagination,
  ApiError,
  PaginationMeta,
} from "@/api/configs/types";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export type Role = "ADMIN" | "CASHIER" | "CUSTOMER";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
};

// ─── Menu ─────────────────────────────────────────────────────────────────────

export type MenuCategory = "COFFEE" | "NON_COFFEE" | "FOOD" | "SNACK" | "OTHER";

export type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  category: MenuCategory;
  imageUrl: string | null;
  isAvailable: boolean;
  stock: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateMenuItemDto = {
  name: string;
  description?: string;
  price: number;
  category: MenuCategory;
  imageUrl?: string;
  isAvailable?: boolean;
  stock?: number;
};

export type UpdateMenuItemDto = Partial<CreateMenuItemDto>;

// ─── Table ────────────────────────────────────────────────────────────────────

export type TableStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED";

export type Table = {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  qrCode: string | null;
  createdAt: string;
  updatedAt: string;
  orders?: Order[];
};

// ─── Order ────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "SERVED"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus = "UNPAID" | "PAID" | "REFUNDED";

export type OrderType = "DINE_IN" | "TAKE_AWAY";

export type OrderItem = {
  id: string;
  quantity: number;
  price: string;
  notes: string | null;
  menuItem: Pick<MenuItem, "id" | "name" | "imageUrl">;
};

export type Order = {
  id: string;
  orderNumber: string;
  type: OrderType;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: string;
  notes: string | null;
  tableId: string | null;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
  table: Pick<Table, "number"> | null;
  user: Pick<User, "id" | "name" | "email"> | null;
  orderItems: OrderItem[];
};

// ─── Cart (customer-facing) ───────────────────────────────────────────────────

export type CartItem = {
  menuItem: MenuItem;
  quantity: number;
  notes: string;
};
