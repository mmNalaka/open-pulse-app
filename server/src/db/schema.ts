import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// ============================================================================
// USERS TABLE - Comprehensive User Profile Schema
// ============================================================================
export const users = pgTable(
  "users",
  {
    // Primary identifier
    id: uuid("id").defaultRandom().primaryKey(),

    // === BASIC INFORMATION ===
    // Email is now handled in separate emails table for multi-email support
    // but keeping a denormalized primary email for quick access
    email: varchar("email", { length: 255 }),
    emailVerified: boolean("email_verified").default(false).notNull(),

    // === PROFILE INFORMATION ===
    firstName: varchar("first_name", { length: 100 }),
    lastName: varchar("last_name", { length: 100 }),
    displayName: varchar("display_name", { length: 200 }),
    avatarUrl: text("avatar_url"),
    bio: text("bio"),

    // === CONTACT INFORMATION ===
    phoneNumber: varchar("phone_number", { length: 20 }),
    phoneVerified: boolean("phone_verified").default(false).notNull(),

    // === LOCATION ===
    timezone: varchar("timezone", { length: 50 }).default("UTC"),
    locale: varchar("locale", { length: 10 }).default("en"),
    country: varchar("country", { length: 2 }), // ISO 3166-1 alpha-2

    // === ACCOUNT STATUS ===
    status: varchar("status", { length: 20 }).default("active").notNull(), // active, suspended, deleted, pending
    isEmailVerified: boolean("is_email_verified").default(false).notNull(),
    isPhoneVerified: boolean("is_phone_verified").default(false).notNull(),

    // === SECURITY ===
    twoFactorEnabled: boolean("two_factor_enabled").default(false).notNull(),
    twoFactorSecret: varchar("two_factor_secret", { length: 255 }), // Encrypted TOTP secret
    backupCodesHash: text("backup_codes_hash"), // Hashed backup codes for 2FA recovery

    // Security preferences
    securityLevel: varchar("security_level", { length: 20 }).default("standard").notNull(), // standard, high, maximum
    requirePasswordChange: boolean("require_password_change").default(false).notNull(),
    passwordChangedAt: timestamp("password_changed_at", { withTimezone: true }),

    // === TERMS & CONSENT ===
    termsAcceptedAt: timestamp("terms_accepted_at", { withTimezone: true }),
    termsAcceptedVersion: varchar("terms_accepted_version", { length: 20 }),
    privacyAcceptedAt: timestamp("privacy_accepted_at", { withTimezone: true }),
    marketingConsent: boolean("marketing_consent").default(false).notNull(),

    // === ACTIVITY TRACKING ===
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    lastLoginIp: varchar("last_login_ip", { length: 45 }),
    lastActiveAt: timestamp("last_active_at", { withTimezone: true }),
    loginCount: integer("login_count").default(0).notNull(),
    failedLoginAttempts: integer("failed_login_attempts").default(0).notNull(),
    lastFailedLoginAt: timestamp("last_failed_login_at", { withTimezone: true }),

    // === ACCOUNT LOCKING ===
    lockedAt: timestamp("locked_at", { withTimezone: true }),
    lockedUntil: timestamp("locked_until", { withTimezone: true }),
    lockReason: varchar("lock_reason", { length: 255 }),

    // === DELETION & DEACTIVATION ===
    deactivatedAt: timestamp("deactivated_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }), // Soft delete
    deletionScheduledAt: timestamp("deletion_scheduled_at", { withTimezone: true }), // GDPR compliance

    // === METADATA & CUSTOM FIELDS ===
    metadata: jsonb("metadata").default({}), // Flexible field for custom attributes
    preferences: jsonb("preferences").default({}), // User preferences (theme, notifications, etc.)

    // === ROLE & PERMISSIONS (if using RBAC) ===
    role: varchar("role", { length: 50 }).default("user").notNull(), // user, admin, moderator, etc.
    permissions: jsonb("permissions").default([]), // Array of permission strings

    // === REFERRAL & TRACKING ===
    referralCode: varchar("referral_code", { length: 20 }).unique(),
    referredBy: uuid("referred_by"),
    utmSource: varchar("utm_source", { length: 100 }),
    utmMedium: varchar("utm_medium", { length: 100 }),
    utmCampaign: varchar("utm_campaign", { length: 100 }),

    // === SUBSCRIPTION & BILLING (if applicable) ===
    subscriptionStatus: varchar("subscription_status", { length: 20 }), // trial, active, past_due, canceled
    subscriptionTier: varchar("subscription_tier", { length: 50 }), // free, basic, pro, enterprise
    subscriptionExpiresAt: timestamp("subscription_expires_at", { withTimezone: true }),

    // === TIMESTAMPS ===
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    // Indexes for frequently queried fields
    emailIdx: index("users_email_idx").on(table.email),
    statusIdx: index("users_status_idx").on(table.status),
    phoneIdx: index("users_phone_idx").on(table.phoneNumber),
    referralCodeIdx: uniqueIndex("users_referral_code_idx").on(table.referralCode),
    deletedAtIdx: index("users_deleted_at_idx").on(table.deletedAt), // For filtering out soft-deleted users
    lastLoginIdx: index("users_last_login_idx").on(table.lastLoginAt),
    subscriptionStatusIdx: index("users_subscription_status_idx").on(table.subscriptionStatus),
    createdAtIdx: index("users_created_at_idx").on(table.createdAt),
  })
);

// ============================================================================
// EMAILS TABLE (Multi-email support)
// ============================================================================
export const emails = pgTable(
  "emails",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    address: varchar("address", { length: 255 }).notNull(),
    verified: boolean("verified").default(false).notNull(),
    isPrimary: boolean("is_primary").default(false).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    addressUnique: uniqueIndex("emails_address_unique_idx").on(table.address),
    userIdIdx: index("emails_user_id_idx").on(table.userId),
    userIdPrimaryIdx: index("emails_user_id_primary_idx").on(table.userId, table.isPrimary),
  })
);

// ============================================================================
// PASSCODES TABLE (Email/SMS verification codes)
// ============================================================================
export const passcodes = pgTable(
  "passcodes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    emailId: uuid("email_id").references(() => emails.id, { onDelete: "cascade" }),

    code: varchar("code", { length: 32 }).notNull(),
    ttl: integer("ttl").notNull(), // Time to live in seconds
    tryCount: integer("try_count").default(0).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("passcodes_user_id_idx").on(table.userId),
    emailIdIdx: index("passcodes_email_id_idx").on(table.emailId),
  })
);

// ============================================================================
// WEBAUTHN CREDENTIALS (Passkeys/Security Keys)
// ============================================================================
export const webauthnCredentials = pgTable(
  "webauthn_credentials",
  {
    id: varchar("id", { length: 255 }).primaryKey(), // Credential ID from authenticator
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // WebAuthn credential data
    publicKey: text("public_key").notNull(), // Base64 encoded
    attestationType: varchar("attestation_type", { length: 32 }).notNull(),
    aaguid: uuid("aaguid").notNull(), // Authenticator AAGUID
    signCount: integer("sign_count").default(0).notNull(),

    // Transports supported by the credential
    transports: jsonb("transports").default([]).notNull(), // ["usb", "nfc", "ble", "internal"]

    // Optional metadata
    name: varchar("name", { length: 255 }), // User-friendly name
    backupEligible: boolean("backup_eligible").default(false).notNull(),
    backupState: boolean("backup_state").default(false).notNull(),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
  },
  (table) => ({
    userIdIdx: index("webauthn_credentials_user_id_idx").on(table.userId),
  })
);

// ============================================================================
// WEBAUTHN SESSION DATA (For ongoing WebAuthn ceremonies)
// ============================================================================
export const webauthnSessionData = pgTable(
  "webauthn_session_data",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    challenge: varchar("challenge", { length: 255 }).notNull().unique(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    emailId: uuid("email_id").references(() => emails.id, { onDelete: "cascade" }),

    operation: varchar("operation", { length: 32 }).notNull(), // 'auth' or 'registration'
    userVerification: varchar("user_verification", { length: 32 }).notNull(),

    // Additional session data
    allowedCredentials: jsonb("allowed_credentials").default([]),

    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    challengeIdx: uniqueIndex("webauthn_session_data_challenge_idx").on(table.challenge),
    expiresAtIdx: index("webauthn_session_data_expires_at_idx").on(table.expiresAt),
  })
);

// ============================================================================
// PASSWORDS (Optional - for password-based fallback)
// ============================================================================
export const passwords = pgTable(
  "passwords",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .unique(),
    password: varchar("password", { length: 255 }).notNull(), // Bcrypt hashed

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: uniqueIndex("passwords_user_id_idx").on(table.userId),
  })
);

// ============================================================================
// SESSIONS
// ============================================================================
export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Session token (should be hashed in production)
    token: varchar("token", { length: 255 }).notNull().unique(),

    // User agent and IP for security
    userAgent: text("user_agent"),
    ipAddress: varchar("ip_address", { length: 45 }), // IPv6 max length

    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    tokenIdx: uniqueIndex("sessions_token_idx").on(table.token),
    userIdIdx: index("sessions_user_id_idx").on(table.userId),
    expiresAtIdx: index("sessions_expires_at_idx").on(table.expiresAt),
  })
);

// ============================================================================
// TOKENS (For JWT management and refresh tokens)
// ============================================================================
export const tokens = pgTable(
  "tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    value: varchar("value", { length: 500 }).notNull().unique(), // JWT or refresh token
    type: varchar("type", { length: 32 }).notNull(), // 'access', 'refresh', 'reset_password'

    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    valueIdx: uniqueIndex("tokens_value_idx").on(table.value),
    userIdTypeIdx: index("tokens_user_id_type_idx").on(table.userId, table.type),
    expiresAtIdx: index("tokens_expires_at_idx").on(table.expiresAt),
  })
);

// ============================================================================
// AUDIT LOGS
// ============================================================================
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),

    type: varchar("type", { length: 64 }).notNull(), // e.g., 'login', 'logout', 'credential_added'
    actorType: varchar("actor_type", { length: 32 }).notNull(), // 'user', 'admin', 'system'
    actorId: uuid("actor_id"),

    // Metadata about the action
    metadata: jsonb("metadata").default({}),

    // Request context
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("audit_logs_user_id_idx").on(table.userId),
    typeIdx: index("audit_logs_type_idx").on(table.type),
    createdAtIdx: index("audit_logs_created_at_idx").on(table.createdAt),
  })
);

// ============================================================================
// USERNAME (Optional - for username support)
// ============================================================================
export const usernames = pgTable(
  "usernames",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .unique(),
    username: varchar("username", { length: 255 }).notNull().unique(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    usernameIdx: uniqueIndex("usernames_username_idx").on(table.username),
    userIdIdx: uniqueIndex("usernames_user_id_idx").on(table.userId),
  })
);

// ============================================================================
// THIRD PARTY AUTH (OAuth connections)
// ============================================================================
export const identities = pgTable(
  "identities",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    provider: varchar("provider", { length: 64 }).notNull(), // 'google', 'github', 'apple'
    providerId: varchar("provider_id", { length: 255 }).notNull(), // User ID from the provider

    // Optional metadata
    data: jsonb("data").default({}), // Store provider-specific data

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    providerIdUnique: uniqueIndex("identities_provider_id_unique_idx").on(
      table.provider,
      table.providerId
    ),
    userIdIdx: index("identities_user_id_idx").on(table.userId),
  })
);

// ============================================================================
// RELATIONS
// ============================================================================

export const usersRelations = relations(users, ({ many, one }) => ({
  emails: many(emails),
  webauthnCredentials: many(webauthnCredentials),
  password: one(passwords),
  sessions: many(sessions),
  tokens: many(tokens),
  auditLogs: many(auditLogs),
  username: one(usernames),
  identities: many(identities),
  passcodes: many(passcodes),
  referredUsers: many(users, { relationName: "referral" }), // Users referred by this user
  referrer: one(users, {
    // User who referred this user
    fields: [users.referredBy],
    references: [users.id],
    relationName: "referral",
  }),
}));

export const emailsRelations = relations(emails, ({ one, many }) => ({
  user: one(users, {
    fields: [emails.userId],
    references: [users.id],
  }),
  passcodes: many(passcodes),
}));

export const webauthnCredentialsRelations = relations(webauthnCredentials, ({ one }) => ({
  user: one(users, {
    fields: [webauthnCredentials.userId],
    references: [users.id],
  }),
}));

export const passwordsRelations = relations(passwords, ({ one }) => ({
  user: one(users, {
    fields: [passwords.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const tokensRelations = relations(tokens, ({ one }) => ({
  user: one(users, {
    fields: [tokens.userId],
    references: [users.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));

export const usernamesRelations = relations(usernames, ({ one }) => ({
  user: one(users, {
    fields: [usernames.userId],
    references: [users.id],
  }),
}));

export const identitiesRelations = relations(identities, ({ one }) => ({
  user: one(users, {
    fields: [identities.userId],
    references: [users.id],
  }),
}));

export const passcodesRelations = relations(passcodes, ({ one }) => ({
  user: one(users, {
    fields: [passcodes.userId],
    references: [users.id],
  }),
  email: one(emails, {
    fields: [passcodes.emailId],
    references: [emails.id],
  }),
}));

export const webauthnSessionDataRelations = relations(webauthnSessionData, ({ one }) => ({
  user: one(users, {
    fields: [webauthnSessionData.userId],
    references: [users.id],
  }),
  email: one(emails, {
    fields: [webauthnSessionData.emailId],
    references: [emails.id],
  }),
}));
