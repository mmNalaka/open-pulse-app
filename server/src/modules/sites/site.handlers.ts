import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";
import type { AppBindings } from "@/app";
import { SiteRepository } from "@/repositories/site.repo";
import { NotFoundError, UnauthorizedError } from "@/utils/app-error";
import { paginatedSuccessResponse, successResponse } from "@/utils/http.utils";
import { calculatePagination } from "@/utils/pagination.utils";
import {
  createSiteSchema,
  getSiteParamSchema,
  listSitesQuerySchema,
  updateSiteSchema,
} from "./site.schema";

const factory = createFactory<AppBindings>();

// Create site
export const createSiteHandler = factory.createHandlers(
  zValidator("json", createSiteSchema),
  async (c) => {
    const creatorId = c.get("user")?.id;
    const body = c.req.valid("json");
    const { name, domain, organizationId } = body;

    if (!creatorId) {
      throw new UnauthorizedError("User not authenticated");
    }

    const siteConfig = await SiteRepository.createSite({
      name,
      domain,
      organizationId,
      metadata: null,
      createdBy: creatorId,
    });

    if (!siteConfig) {
      throw new Error("Failed to create site");
    }

    return successResponse(c, siteConfig);
  }
);

// Get site by id
export const getSiteHandler = factory.createHandlers(
  zValidator("param", getSiteParamSchema),
  async (c) => {
    const { siteId } = c.req.valid("param");
    const siteConfig = await SiteRepository.getSiteConfig(siteId);
    if (!siteConfig) {
      throw new NotFoundError("Site not found");
    }
    return successResponse(c, siteConfig);
  }
);

// Update site
export const updateSiteHandler = factory.createHandlers(
  zValidator("param", getSiteParamSchema),
  zValidator("json", updateSiteSchema),
  async (c) => {
    const { siteId } = c.req.valid("param");
    const body = c.req.valid("json");
    const { name, domain, organizationId } = body;

    const siteConfig = await SiteRepository.getSiteConfig(siteId);
    if (!siteConfig) {
      throw new NotFoundError("Site not found");
    }

    const updatedSiteConfig = await SiteRepository.updateSite(siteId, {
      name,
      domain,
      organizationId,
    });

    return successResponse(c, updatedSiteConfig);
  }
);

// Delete site
export const deleteSiteHandler = factory.createHandlers(
  zValidator("param", getSiteParamSchema),
  async (c) => {
    const siteId = c.req.param("id");
    if (!siteId) {
      throw new Error("Site ID is required");
    }
    const siteConfig = await SiteRepository.getSiteConfig(siteId);
    if (!siteConfig) {
      throw new NotFoundError("Site not found");
    }
    await SiteRepository.deleteSite(siteId);
    return successResponse(c, { message: "Site deleted successfully" });
  }
);

// List sites
export const listSitesHandler = factory.createHandlers(
  zValidator("query", listSitesQuerySchema),
  async (c) => {
    const { page, limit } = c.req.valid("query");
    const { sites, total } = await SiteRepository.listSites(page, limit);

    const pagination = calculatePagination(page, limit, total);
    return paginatedSuccessResponse(c, sites, pagination);
  }
);
