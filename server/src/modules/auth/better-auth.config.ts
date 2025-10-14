/** biome-ignore-all lint/performance/noNamespaceImport: no treeshaking needed for schema */
/** biome-ignore-all lint/suspicious/noConsole: needed for invite logging */

import { betterAuth, type Session, type User } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import { apiKey, customSession, jwt, organization } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NEW_USER_TIME_WINDOW } from "shared/dist/auth.const";
import { db } from "../../db";
import * as schema from "../../db/schema";

/**
 * Database hook to set active organization when creating a session
 */
async function setActiveOrganizationOnSessionCreate(session: Session) {
  const membership = await db
    .select()
    .from(schema.member)
    .where(eq(schema.member.userId, session.userId))
    .limit(1);

  if (membership.length > 0) {
    return {
      data: {
        ...session,
        activeOrganizationId: membership[0]?.organizationId,
      },
    };
  }

  return { data: session };
}

/**
 * Create organization for new users
 */
async function createOrganizationForNewUser(user: User, session: Session) {
  try {
    // Check if user already has an organization
    const existingMember = await db
      .select()
      .from(schema.member)
      .where(eq(schema.member.userId, user.id))
      .limit(1);

    if (existingMember.length === 0) {
      // Create organization for new user
      const orgName = user.name || user.email.split("@")[0];
      const orgSlug = nanoid(6);

      const [newOrg] = await db
        .insert(schema.organization)
        .values({
          id: nanoid(10),
          name: `${orgName}'s Organization`,
          slug: orgSlug,
          createdAt: new Date(),
        })
        .returning();

      if (!newOrg) {
        throw new Error("Failed to create organization");
      }

      // Create membership with owner role
      await db.insert(schema.member).values({
        id: crypto.randomUUID(),
        organizationId: newOrg.id,
        userId: user.id,
        role: "owner",
        createdAt: new Date(),
      });

      // Update session with active organization
      await db
        .update(schema.session)
        .set({
          activeOrganizationId: newOrg?.id,
        })
        .where(eq(schema.session.id, session.id));
    }
  } catch (error) {
    console.error("Error creating organization for new user:", error);
  }
}

/**
 * Find user roles
 */
async function findUSerRoles(useId: string) {
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
      .where(eq(schema.member.userId, useId));
  } catch (error) {
    console.error("Error finding user roles:", error);
    return [];
  }
}

// biome-ignore lint/suspicious/noTsIgnore: false positive
// @ts-ignore
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
        const url = new URL(
          `${process.env.CORS_ORIGIN || "http://localhost:3000"}/auth/accept-invitation`
        );
        url.searchParams.set("token", invitation.id);
        url.searchParams.set("orgName", invitation.organization.name);
        url.searchParams.set("inviterName", invitation.inviter.user.name);
        console.log("Invite Link:", url.toString());
        console.log("========================");

        await Promise.resolve();
      },
    }),
    apiKey(),
    customSession(async ({ user, session }) => {
      const organizations = await findUSerRoles(session.userId);
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
        const { user, session } = ctx.context.session;

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
          await createOrganizationForNewUser(user, session);
        }
      }
    }),
  },
});
