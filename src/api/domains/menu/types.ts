import {
  ApiResult,
  BodyOnlyRequest,
  PathOnlyRequest,
  PathBodyRequest,
  ParamsOnlyRequest,
} from "@/api/configs/types";
import { MenuItem, CreateMenuItemDto, UpdateMenuItemDto } from "@/types";

export type GetMenuListParams = {
  category?: string;
  available?: boolean;
  search?: string;
};

export type GetMenuListRequest = ParamsOnlyRequest<GetMenuListParams>;
export type GetMenuListResponse = ApiResult<MenuItem[]>;

export type GetMenuDetailRequest = PathOnlyRequest<{ id: string }>;
export type GetMenuDetailResponse = ApiResult<MenuItem>;

export type CreateMenuRequest = BodyOnlyRequest<CreateMenuItemDto>;
export type CreateMenuResponse = ApiResult<MenuItem>;

export type UpdateMenuRequest = PathBodyRequest<{ id: string }, UpdateMenuItemDto>;
export type UpdateMenuResponse = ApiResult<MenuItem>;

export type ToggleMenuRequest = PathOnlyRequest<{ id: string }>;
export type ToggleMenuResponse = ApiResult<MenuItem>;

export type DeleteMenuRequest = PathOnlyRequest<{ id: string }>;
export type DeleteMenuResponse = ApiResult<MenuItem>;
