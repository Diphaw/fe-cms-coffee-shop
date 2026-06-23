import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import { ApiError } from "@/api/configs/types";
import { takeawayService } from "./service";
import { CreateTakeawayRequest, CreateTakeawayResponse } from "./types";
import { orderKeys } from "../orders/query";

export const useCreateTakeaway = (
  options?: Partial<UseMutationOptions<CreateTakeawayResponse, ApiError, CreateTakeawayRequest>>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateTakeawayRequest) => takeawayService.createTakeaway(request),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: orderKeys.all });
      if (options?.onSuccess) {
        await options.onSuccess(...args);
      }
    },
  });
};
