import type { TableData } from "@/api/domains/tables/types";
import type { TableFormValues } from "./schema";

export interface TableCardProps {
  table: TableData;
  onEdit: (table: TableData) => void;
  onDelete: (id: string) => void;
  onPrint: (table: TableData) => void;
}

export interface TableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTable: TableData | null;
  onSubmit: (values: TableFormValues) => void;
  submitting: boolean;
}
