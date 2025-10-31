import { and, eq } from "drizzle-orm";
import { db } from "@/db/postgres";
import { activeSessions } from "@/db/postgres/schema";
import { logger } from "@/libs/logger";
import { newUUID } from "@/utils/uudi.utils";

const LOGGER_ID = "active-sessions-repo";
const TABLE_PREFIX = "se";

type SessionData = {
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
};

/**
 * Get an active session by siteId and userId
 */
export const getActiveSession = async (siteId: string, userId: string) => {
  try {
    const session = await db
      .select()
      .from(activeSessions)
      .where(
        and(
          eq(activeSessions.siteId, siteId),
          eq(activeSessions.userId, userId),
          eq(activeSessions.isActive, true)
        )
      )
      .limit(1);

    return session[0] || null;
  } catch (error) {
    logger.error(
      { error, siteId, userId },
      `${LOGGER_ID}:getActiveSession: Failed to get active session`
    );
    return null;
  }
};

/**
 * Create a new active session
 * Returns the session_id (which is the id field)
 */
export const createActiveSession = async (siteId: string, data?: SessionData) => {
  try {
    const sessionId = newUUID(TABLE_PREFIX);
    const session = await db
      .insert(activeSessions)
      .values({
        id: sessionId,
        siteId,
        userId: data?.userId || null,
        ipAddress: data?.ipAddress || null,
        userAgent: data?.userAgent || null,
        isActive: true,
      })
      .returning();

    return session[0] || null;
  } catch (error) {
    logger.error(
      { error, siteId },
      `${LOGGER_ID}:createActiveSession: Failed to create active session`
    );
    return null;
  }
};

/**
 * Update an active session's last activity and metadata
 */
export const updateActiveSession = async (sessionId: string, data?: SessionData) => {
  try {
    const updated = await db
      .update(activeSessions)
      .set({
        lastActivity: new Date(),
        userId: data?.userId ? data.userId : undefined,
        userAgent: data?.userAgent ? data.userAgent : undefined,
      })
      .where(eq(activeSessions.id, sessionId))
      .returning();

    return updated[0] || null;
  } catch (error) {
    logger.error(
      { error, sessionId },
      `${LOGGER_ID}:updateActiveSession: Failed to update active session`
    );
    return null;
  }
};

/**
 * Mark a session as inactive
 */
export const endActiveSession = async (sessionId: string) => {
  try {
    const updated = await db
      .update(activeSessions)
      .set({
        isActive: false,
      })
      .where(eq(activeSessions.id, sessionId))
      .returning();

    return updated[0] || null;
  } catch (error) {
    logger.error(
      { error, sessionId },
      `${LOGGER_ID}:endActiveSession: Failed to end active session`
    );
    return null;
  }
};

export const ActiveSessionsRepository = {
  getActiveSession,
  createActiveSession,
  updateActiveSession,
  endActiveSession,
};
