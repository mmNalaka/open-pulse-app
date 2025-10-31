import { logger } from "@/libs/logger";
import {
  createActiveSession,
  endActiveSession,
  getActiveSession,
  updateActiveSession,
} from "@/repositories/active-sessions.repo";

const LOGGER_ID = "session-service";

type SessionData = {
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
};

/**
 * Create or update an active session
 * Identifies session by siteId and userId
 * If session exists, updates lastActivity
 * If not, creates new session and returns the generated sessionId
 */
export const createOrUpdateSession = async (siteId: string, data?: SessionData) => {
  try {
    // Try to find existing session by siteId and userId
    if (data?.userId) {
      const existingSession = await getActiveSession(siteId, data.userId);

      if (existingSession) {
        // Update last activity
        return await updateActiveSession(existingSession.id, data);
      }
    }

    // Create new session (server generates sessionId)
    return await createActiveSession(siteId, data);
  } catch (error) {
    logger.error(
      { error, siteId, data },
      `${LOGGER_ID}:createOrUpdateSession: Failed to create or update session`
    );
    return null;
  }
};

/**
 * Mark a session as inactive
 * Business logic layer that delegates to repository
 */
export const endSession = async (sessionId: string) => {
  try {
    return await endActiveSession(sessionId);
  } catch (error) {
    logger.error({ error, sessionId }, `${LOGGER_ID}:endSession: Failed to end session`);
    return null;
  }
};

export const sessionService = {
  createOrUpdateSession,
  endSession,
};
