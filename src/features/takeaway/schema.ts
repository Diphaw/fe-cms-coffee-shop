import z from "zod";

export const takeawayItemSchema = z.object({
  menuItemId: z.string().min(1, "Menu item ID harus diisi"),
  quantity: z.number().int().min(1, "Jumlah item harus minimal 1"),
  notes: z.string().optional(),
});

export const takeawaySchema = z.object({
  items: z.array(takeawayItemSchema).min(1, "Pesanan harus berisi minimal 1 item"),
  notes: z.string().optional(),
});

export type TakeawayFormValues = z.infer<typeof takeawaySchema>;
export type TakeawayItemValues = z.infer<typeof takeawayItemSchema>;
