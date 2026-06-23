import type { MenuItem } from "@/types";
import type { MenuFormValues } from "./schema";

export interface MenuItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: MenuItem | null;
  onSubmit: (values: MenuFormValues) => void;
  submitting: boolean;
}

export interface MenuItemsTableProps {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}
