import z from "zod";

export const tableSchema = z.object({
  number: z
    .string()
    .min(1, "Nomor meja harus diisi")
    .refine((val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num > 0;
    }, "Nomor meja harus berupa angka positif"),
  capacity: z
    .string()
    .min(1, "Kapasitas meja harus diisi")
    .refine((val) => {
      const cap = parseInt(val, 10);
      return !isNaN(cap) && cap > 0;
    }, "Kapasitas meja harus berupa angka positif"),
});

export type TableFormValues = z.infer<typeof tableSchema>;
