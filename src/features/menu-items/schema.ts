import z from "zod";

export const menuSchema = z.object({
  name: z.string().min(1, "Nama menu harus diisi"),
  description: z.string().optional(),
  price: z
    .string()
    .min(1, "Harga menu harus diisi")
    .refine((val) => {
      const price = parseFloat(val);
      return !isNaN(price) && price >= 0;
    }, "Harga menu tidak valid"),
  category: z.string().min(1, "Kategori harus dipilih"),
  stock: z
    .string()
    .min(1, "Stok menu harus diisi")
    .refine((val) => {
      const stock = parseInt(val, 10);
      return !isNaN(stock) && stock >= 0;
    }, "Stok menu tidak valid"),
  isAvailable: z.boolean(),
  imageUrl: z.string().optional(),
});

export type MenuFormValues = z.infer<typeof menuSchema>;
