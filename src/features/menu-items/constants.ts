import type { MenuCategory } from "@/api/domains/menu/types";
import type { MenuFormValues } from "./schema";
import type { PaginationState, ModalFormState, ModalDeleteState, FilterState } from "./types";

export const DEFAULT_PAGINATION: PaginationState = {
  limit: 10,
  page: 1,
};

export const DEFAULT_MODAL_FORM: ModalFormState = {
  open: false,
  type: "add",
  id: null,
};

export const DEFAULT_MODAL_DELETE: ModalDeleteState = {
  open: false,
  id: null,
};

export const DEFAULT_FORM_VALUES: MenuFormValues = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  isAvailable: true,
  imageUrl: "",
};

export const DEFAULT_FILTER: FilterState = {
  search: "",
  category: "ALL",
};

export const CATEGORIES: MenuCategory[] = ["COFFEE", "NON_COFFEE", "FOOD", "SNACK", "OTHER"];

export const CATEGORY_LABELS: Record<MenuCategory, string> = {
  COFFEE: "Coffee",
  NON_COFFEE: "Non-Coffee",
  FOOD: "Makanan",
  SNACK: "Snack",
  OTHER: "Lainnya",
};
