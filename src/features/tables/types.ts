import type { Table } from "@/types";
import type { TableFormValues } from "./schema";

export interface TableCardProps {
  table: Table;
  onEdit: (table: Table) => void;
  onDelete: (id: string) => void;
  onPrint: (table: Table) => void;
}

export interface TableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTable: Table | null;
  onSubmit: (values: TableFormValues) => void;
  submitting: boolean;
}
