export interface AddTakeawayItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes: string;
}

export interface AddTakeawayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}
