import type { MenuItemData } from "@/api/domains/menu/types";
import type { MenuFormValues } from "./schema";

export interface MenuItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: MenuItemData | null;
  onSubmit: (values: MenuFormValues) => void;
  submitting: boolean;
}

export interface MenuItemsTableProps {
  items: MenuItemData[];
  onEdit: (item: MenuItemData) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export type PaginationState = {
  page: number;
  limit: number;
};

export type ModalFormState = {
  open: boolean;
  type: "add" | "edit";
  id: string | null;
};

export type ModalDeleteState = {
  open: boolean;
  id: string | null;
};

export type FilterState = {
  search: string;
  category: string;
};
