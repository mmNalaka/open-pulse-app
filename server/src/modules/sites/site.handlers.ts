import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";
import type { AppBindings } from "@/app";
import { createSite, listSites } from "@/repositories/site.repos";
import { UnauthorizedError } from "@/utils/app-error";
import { successResponse } from "@/utils/http.utils";
import { createSiteSchema } from "./site.schema";

const factory = createFactory<AppBindings>();

export const createSiteHandler = factory.createHandlers(
  zValidator("json", createSiteSchema),
  async (c) => {
    const creatorId = c.get("user")?.id;
    const body = c.req.valid("json");
    const { name, domain, organizationId } = body;

    if (!creatorId) {
      throw new UnauthorizedError("User not authenticated");
    }

    const siteConfig = await createSite({
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

export const listSitesHandler = factory.createHandlers(async (c) => {
  const sites = await listSites();
  return successResponse(c, sites);
});
