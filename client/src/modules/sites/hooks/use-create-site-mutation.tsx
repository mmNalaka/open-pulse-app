import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { client, queryClient } from "@/lib/api-client";
import { listSitesQueryKey } from "./use-list-sites-query";

type CreateSiteData = Parameters<typeof client.api.sites.$post>[0]["json"];
type CreateSiteResponse = Awaited<ReturnType<typeof client.api.sites.$post>>;

const createSiteHandler = async (data: CreateSiteData): Promise<CreateSiteResponse> => {
  const response = await client.api.sites.$post({
    json: data,
  });

  if (!response.ok) {
    throw new Error("Failed to create site");
  }

  return response;
};

type UseCreateSiteMutationOptions = Omit<
  UseMutationOptions<CreateSiteResponse, Error, CreateSiteData>,
  "mutationFn"
>;

export const useCreateSiteMutation = (options?: UseCreateSiteMutationOptions) =>
  useMutation<CreateSiteResponse, Error, CreateSiteData>({
    mutationFn: createSiteHandler,
    retry: 1,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30_000),
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: listSitesQueryKey,
      });

      options?.onSuccess?.(data, variables, context, mutation);
      toast.success("Site created successfully");
    },
    onError: (error, variables, context, mutation) => {
      options?.onError?.(error, variables, context, mutation);
      toast.error("Failed to create site");
    },
    ...options,
  });
