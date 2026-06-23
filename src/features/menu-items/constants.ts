import type { MenuCategory } from "@/types";
import type { MenuFormValues } from "./schema";

export const CATEGORIES: MenuCategory[] = ["COFFEE", "NON_COFFEE", "FOOD", "SNACK", "OTHER"];

export const CATEGORY_LABELS: Record<MenuCategory, string> = {
  COFFEE: "Coffee",
  NON_COFFEE: "Non-Coffee",
  FOOD: "Makanan",
  SNACK: "Snack",
  OTHER: "Lainnya",
};

export const DEFAULT_FORM: MenuFormValues = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  isAvailable: true,
  imageUrl: "",
};
