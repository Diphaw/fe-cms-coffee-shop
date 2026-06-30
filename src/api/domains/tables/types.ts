import {
  ApiResult,
  ApiResultWithPagination,
  BodyOnlyRequest,
  PathBodyRequest,
  PathOnlyRequest,
  ParamsOnlyRequest,
} from "@/api/configs/types";

// ===============================================
// Type Request and Response Container
// ===============================================

export type GetTableListRequest = ParamsOnlyRequest<GetTableListParams>;
export type GetTableListResponse = ApiResultWithPagination<TableData>;

export type GetTableDetailRequest = PathOnlyRequest<{ id: string }>;
export type GetTableDetailResponse = ApiResult<TableData>;

export type CreateTableRequest = BodyOnlyRequest<CreateTableBody>;
export type CreateTableResponse = ApiResult<TableData>;

export type UpdateTableRequest = PathBodyRequest<{ id: string }, UpdateTableBody>;
export type UpdateTableResponse = ApiResult<TableData>;

export type DeleteTableRequest = PathOnlyRequest<{ id: string }>;
export type DeleteTableResponse = ApiResult<TableData>;

// ===============================================
// Type Definition Here
// ===============================================

export type GetTableListParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type TableStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED";

export type CreateTableBody = {
  number: number;
  capacity?: number;
};

export type UpdateTableBody = {
  number?: number;
  capacity?: number;
};

export type TableData = {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  qrCode: string | null;
  createdAt: string;
  updatedAt: string;
  orders?: OrderSummary[];
};

export type OrderSummary = {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: string;
};
