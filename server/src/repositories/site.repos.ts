import { eq } from "drizzle-orm";
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

export const listSites = async () => {
  try {
    const siteConfig = await db.select().from(site);
    return siteConfig;
  } catch (error) {
    logger.error({ error }, `${LOGGER_ID}:listSites: Failed to list sites`);
    return [];
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
