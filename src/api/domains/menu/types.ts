import {
  ApiResult,
  ApiResultWithPagination,
  BodyOnlyRequest,
  ParamsOnlyRequest,
  PathBodyRequest,
  PathOnlyRequest,
} from "@/api/configs/types";

// ===============================================
// Type Request and Response Container
// ===============================================

export type GetMenuListRequest = ParamsOnlyRequest<GetMenuListParams>;
export type GetMenuListResponse = ApiResultWithPagination<MenuItemData>;

export type GetMenuDetailRequest = PathOnlyRequest<{ id: string }>;
export type GetMenuDetailResponse = ApiResult<MenuItemData>;

export type CreateMenuRequest = BodyOnlyRequest<CreateMenuItemBody>;
export type CreateMenuResponse = ApiResult<MenuItemData>;

export type UpdateMenuRequest = PathBodyRequest<{ id: string }, UpdateMenuItemBody>;
export type UpdateMenuResponse = ApiResult<MenuItemData>;

export type ToggleMenuRequest = PathOnlyRequest<{ id: string }>;
export type ToggleMenuResponse = ApiResult<MenuItemData>;

export type DeleteMenuRequest = PathOnlyRequest<{ id: string }>;
export type DeleteMenuResponse = ApiResult<MenuItemData>;

// ===============================================
// Type Definition Here
// ===============================================

export type MenuCategory = "COFFEE" | "NON_COFFEE" | "FOOD" | "SNACK" | "OTHER";

export type GetMenuListParams = {
  category?: string;
  available?: boolean;
  search?: string;
  page?: number;
  limit?: number;
};

export type CreateMenuItemBody = {
  name: string;
  description?: string;
  price: number;
  category: MenuCategory;
  imageUrl?: string;
  isAvailable?: boolean;
  stock?: number;
};

export type UpdateMenuItemBody = Partial<CreateMenuItemBody>;

export type MenuItemData = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  category: MenuCategory;
  imageUrl: string | null;
  isAvailable: boolean;
  stock: number;
  createdAt: string;
  updatedAt: string;
};
