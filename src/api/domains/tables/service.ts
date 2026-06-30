import { baseApi } from "@/api/configs/url";
import {
  GetTableListRequest,
  GetTableListResponse,
  GetTableDetailRequest,
  GetTableDetailResponse,
  CreateTableRequest,
  CreateTableResponse,
  UpdateTableRequest,
  UpdateTableResponse,
  DeleteTableRequest,
  DeleteTableResponse,
} from "./types";

class TablesService {
  async getTableList(request?: GetTableListRequest): Promise<GetTableListResponse> {
    return await baseApi.get("/tables", { params: request?.params });
  }

  async getTableDetail(request: GetTableDetailRequest): Promise<GetTableDetailResponse> {
    return await baseApi.get(`/tables/${request.path?.id}`);
  }

  async createTable(request: CreateTableRequest): Promise<CreateTableResponse> {
    return await baseApi.post("/tables", request.body);
  }

  async updateTable(request: UpdateTableRequest): Promise<UpdateTableResponse> {
    return await baseApi.patch(`/tables/${request.path?.id}`, request.body);
  }

  async deleteTable(request: DeleteTableRequest): Promise<DeleteTableResponse> {
    return await baseApi.delete(`/tables/${request.path?.id}`);
  }
}

export const tablesService = new TablesService();
