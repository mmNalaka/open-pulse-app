import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { client, type InferResponseType } from "@/lib/api-client";

type ListSitesResponse = InferResponseType<typeof client.api.sites.$get>;
export type SitesData = Extract<ListSitesResponse, { success: true }>["data"];

export const listSitesQueryKey = ["sites", "list"] as const;

const fetchSites = async (): Promise<SitesData> => {
  const response = await client.api.sites.$get();

  if (!response.ok) {
    throw new Error("Failed to fetch sites");
  }

  const data = await response.json();

  if (!data.success) {
    const error = new Error(data.message) as Error & { code?: string };
    error.code = data.errorCode;
    throw error;
  }

  return data.data;
};

type UseListSitesQueryOptions = Omit<UseQueryOptions<SitesData, Error>, "queryKey" | "queryFn">;

export const useListSitesQuery = (options?: UseListSitesQueryOptions) =>
  useQuery({
    queryKey: listSitesQueryKey,
    queryFn: fetchSites,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30_000),
    ...options,
  });
