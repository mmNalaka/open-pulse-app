/** biome-ignore-all lint/performance/noNamespaceImport: no treeshaking needed for schema */
/** biome-ignore-all lint/suspicious/noConsole: needed for invite logging */
import { betterAuth, type Session, type User } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import { apiKey, customSession, jwt, organization } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

import { NEW_USER_TIME_WINDOW } from "../../config/constants";
import { db } from "../../db";
import * as schema from "../../db/schema";

/**
 * Type definitions for better type safety
 */
interface UserOrganization {
  orgId: string;
  role: string;
  slug: string | null;
  name: string | null;
  status: string;
}

interface AuthConfig {
  database: ReturnType<typeof drizzleAdapter>;
  trustedOrigins: string[];
  emailAndPassword: { enabled: boolean };
  session: { storeSessionInDatabase: boolean };
  databaseHooks: {
    session: {
      create: {
        before: typeof setActiveOrganizationOnSessionCreate;
      };
    };
  };
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none" | "lax" | "strict";
      secure: boolean;
      httpOnly: boolean;
    };
  };
  plugins: any[];
  hooks: {
    after: any;
  };
}

/**
 * Database hook to set active organization when creating a session
 */
async function setActiveOrganizationOnSessionCreate(session: Session) {
  try {
    const membership = await db
      .select()
      .from(schema.member)
      .where(eq(schema.member.userId, session.userId))
      .limit(1);

    if (membership && membership.length > 0) {
      return {
        data: {
          ...session,
          activeOrganizationId: membership[0]?.organizationId,
        },
      };
    }

    return { data: session };
  } catch (error) {
    console.error("Error setting active organization on session create:", error);
    // Return session without active organization on error
    return { data: session };
  }
}

/**
 * Find user roles and organization memberships
 */
async function findUserRoles(userId: string): Promise<UserOrganization[]> {
  try {
    return await db
      .select({
        orgId: schema.member.organizationId,
        role: schema.member.role,
        slug: schema.organization.slug,
        name: schema.organization.name,
        status: schema.member.status,
      })
      .from(schema.member)
      .leftJoin(schema.organization, eq(schema.member.organizationId, schema.organization.id))
      .where(eq(schema.member.userId, userId));
  } catch (error) {
    console.error("Error finding user roles:", error);
    return [];
  }
}

/**
 * Better Auth configuration
 */
export const auth = betterAuth({
  // Database configuration
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  // Security configuration
  trustedOrigins: [process.env.CORS_ORIGIN || ""],

  // Authentication methods
  emailAndPassword: {
    enabled: true,
  },

  // Session configuration
  session: {
    storeSessionInDatabase: true,
  },

  // Database hooks
  databaseHooks: {
    session: {
      create: {
        before: setActiveOrganizationOnSessionCreate,
      },
    },
  },

  // Advanced configuration
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  },

  // Plugins
  plugins: [
    jwt(),
    organization({
      defaultRole: "member",
      creatorRole: "owner",
      sendInvitationEmail: async (invitation) => {
        try {
          const baseUrl = process.env.CORS_ORIGIN || "http://localhost:3000";
          const url = new URL(`${baseUrl}/auth/accept-invitation`);

          url.searchParams.set("token", invitation.id);
          url.searchParams.set("orgName", invitation.organization.name);
          url.searchParams.set("inviterName", invitation.inviter.user.name);

          console.log("Invite Link:", url.toString());
          console.log("========================");

          await Promise.resolve();
        } catch (error) {
          console.error("Error sending invitation email:", error);
          // Don't throw error to avoid breaking the invitation flow
        }
      },
    }),
    apiKey(),
    customSession(async ({ user, session }) => {
      const organizations = await findUserRoles(session.userId);
      return {
        user,
        session,
        organizations,
      };
    }),
  ],
  // Hooks for handling user lifecycle events
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      // Handle organization creation for new users
      if (ctx.context?.session) {
        const { user } = ctx.context.session;

        // Track whether the user already has or gains a membership in this flow
        let pendingInvitation = false;

        // If the user has a pending invitation, we do not create a new organization for them
        try {
          const pendingInvites = await db
            .select()
            .from(schema.invitation)
            .where(eq(schema.invitation.email, user.email));

          const validPending = pendingInvites
            // Filter out rejected invitations, if expired we do not create a new organization for them
            .filter((inv) => inv.status !== "rejected");

          if (validPending.length > 0) {
            pendingInvitation = true;
          }
        } catch (err) {
          console.error("Error processing pending invitation for user:", err);
        }

        // Check if this is a new user (user.createdAt is recent)
        const userCreatedAt = new Date(user.createdAt);
        const now = new Date();
        const isNewUser = now.getTime() - userCreatedAt.getTime() < NEW_USER_TIME_WINDOW;

        if (isNewUser && !pendingInvitation) {
          // TODO: Create organization for new user
        }
      }
    }),
  },
});
