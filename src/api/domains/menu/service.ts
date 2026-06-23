import { baseApi } from "@/api/configs/url";
import {
  GetMenuListRequest,
  GetMenuListResponse,
  GetMenuDetailRequest,
  GetMenuDetailResponse,
  CreateMenuRequest,
  CreateMenuResponse,
  UpdateMenuRequest,
  UpdateMenuResponse,
  ToggleMenuRequest,
  ToggleMenuResponse,
  DeleteMenuRequest,
  DeleteMenuResponse,
} from "./types";

class MenuService {
  async getMenuList(request?: GetMenuListRequest): Promise<GetMenuListResponse> {
    return await baseApi.get("/menu", { params: request?.params });
  }

  async getMenuDetail(request: GetMenuDetailRequest): Promise<GetMenuDetailResponse> {
    return await baseApi.get(`/menu/${request.path?.id}`);
  }

  async createMenu(request: CreateMenuRequest): Promise<CreateMenuResponse> {
    return await baseApi.post("/menu", request.body);
  }

  async updateMenu(request: UpdateMenuRequest): Promise<UpdateMenuResponse> {
    return await baseApi.patch(`/menu/${request.path?.id}`, request.body);
  }

  async toggleMenu(request: ToggleMenuRequest): Promise<ToggleMenuResponse> {
    return await baseApi.patch(`/menu/${request.path?.id}/toggle`);
  }

  async deleteMenu(request: DeleteMenuRequest): Promise<DeleteMenuResponse> {
    return await baseApi.delete(`/menu/${request.path?.id}`);
  }
}

export const menuService = new MenuService();
