import { z } from "zod";
import { paginationQuerySchema } from "@/utils/pagination.schemas";
import type { site } from "@/db/postgres/schema";

export type SiteData = typeof site.$inferInsert;
export type CreateSiteData = typeof site.$inferInsert;

export const createSiteSchema = z.object({
  name: z.string().min(1),
  domain: z.url(),
  organizationId: z.string().min(1),
});

export const updateSiteSchema = z.object({
  name: z.string().min(1),
  domain: z.url(),
  organizationId: z.string().min(1),
});

export const deleteSiteSchema = z.object({
  siteId: z.string().min(1),
});

export const getSiteParamSchema = z.object({
  siteId: z.string().min(1),
});

export const listSitesParamSchema = z.object({
  siteId: z.string().min(1),
});

export const listSitesQuerySchema = paginationQuerySchema;
