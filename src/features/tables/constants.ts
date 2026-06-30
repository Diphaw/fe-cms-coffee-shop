import type { TableFormValues } from "./schema";
import { PaginationState } from "./types";

export const DEFAULT_FORM: TableFormValues = {
  number: "",
  capacity: "",
};

export const DEFAULT_PAGINATION: PaginationState = {
  page: 1,
  limit: 10,
};
