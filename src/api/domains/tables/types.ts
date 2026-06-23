import { ApiResult, BodyOnlyRequest, PathOnlyRequest, PathBodyRequest } from "@/api/configs/types";
import { Table } from "@/types";

export type GetTableListResponse = ApiResult<Table[]>;

export type GetTableDetailRequest = PathOnlyRequest<{ id: string }>;
export type GetTableDetailResponse = ApiResult<Table>;

export type CreateTableBody = {
  number: number;
  capacity?: number;
};
export type CreateTableRequest = BodyOnlyRequest<CreateTableBody>;
export type CreateTableResponse = ApiResult<Table>;

export type UpdateTableBody = {
  number?: number;
  capacity?: number;
};
export type UpdateTableRequest = PathBodyRequest<{ id: string }, UpdateTableBody>;
export type UpdateTableResponse = ApiResult<Table>;

export type DeleteTableRequest = PathOnlyRequest<{ id: string }>;
export type DeleteTableResponse = ApiResult<Table>;
