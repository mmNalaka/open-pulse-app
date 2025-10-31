import { count, eq } from "drizzle-orm";
import type { Optional } from "shared";
import { db } from "@/db/postgres";
import { site } from "@/db/postgres/schema";
import { logger } from "@/libs/logger";
import { DatabaseError } from "@/utils/app-error";
import { newUUID } from "@/utils/uudi.utils";
import type { CreateSiteData, SiteData } from "../modules/sites/site.schema";

const LOGGER_ID = "site-repos";
const TABLE_PREFIX = "si";

export const getSiteConfig = async (siteId: string): Promise<SiteData | null> => {
  try {
    const siteConfig = await db.select().from(site).where(eq(site.id, siteId));
    return siteConfig[0] || null;
  } catch (error) {
    logger.error(
      { error, siteId },
      `${LOGGER_ID}:getSiteConfig: Failed to get site config for site id `
    );
    return null;
  }
};

export const listSites = async (page = 1, limit = 20) => {
  try {
    const offset = (page - 1) * limit;

    // Get paginated data
    const sites = await db.select().from(site).limit(limit).offset(offset);

    // Get total count for pagination metadata
    const totalResult = await db.select({ count: count() }).from(site);

    const total = totalResult[0]?.count ?? 0;

    return { sites, total };
  } catch (error) {
    logger.error({ error }, `${LOGGER_ID}:listSites: Failed to list sites`);
    return { sites: [], total: 0 };
  }
};

export const createSite = async (data: Optional<CreateSiteData, "id">) => {
  try {
    const siteConfig = await db
      .insert(site)
      .values({
        ...data,
        id: data.id ?? newUUID(TABLE_PREFIX),
      })
      .returning();
    return siteConfig[0];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error({ error, data }, `${LOGGER_ID}:createSite: Failed to create site`);
    throw new DatabaseError("Failed to create site", `Database operation failed: ${errorMessage}`);
  }
};

export const updateSite = async (siteId: string, data: Partial<Optional<CreateSiteData, "id">>) => {
  try {
    const siteConfig = await db
      .update(site)
      .set({
        ...data,
        id: data.id ?? newUUID(TABLE_PREFIX),
      })
      .where(eq(site.id, siteId))
      .returning();
    return siteConfig[0];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error({ error, data }, `${LOGGER_ID}:updateSite: Failed to update site`);
    throw new DatabaseError("Failed to update site", `Database operation failed: ${errorMessage}`);
  }
};

export const deleteSite = async (siteId: string) => {
  try {
    const siteConfig = await db.delete(site).where(eq(site.id, siteId)).returning();
    return siteConfig[0];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error({ error, siteId }, `${LOGGER_ID}:deleteSite: Failed to delete site`);
    throw new DatabaseError("Failed to delete site", `Database operation failed: ${errorMessage}`);
  }
};

export const SiteRepository = {
  getSiteConfig,
  listSites,
  createSite,
  updateSite,
  deleteSite,
};
