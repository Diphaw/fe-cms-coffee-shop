import { baseApi } from "@/api/configs/url";
import { CreateTakeawayRequest, CreateTakeawayResponse } from "./types";

class TakeawayService {
  async createTakeaway(request: CreateTakeawayRequest): Promise<CreateTakeawayResponse> {
    return await baseApi.post("/takeaway", request.body);
  }
}

export const takeawayService = new TakeawayService();
