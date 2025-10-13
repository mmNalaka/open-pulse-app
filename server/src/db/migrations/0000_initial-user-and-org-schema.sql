CREATE TABLE IF NOT EXISTS "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "apikey" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"start" text,
	"prefix" text,
	"key" text NOT NULL,
	"user_id" text NOT NULL,
	"refill_interval" integer,
	"refill_amount" integer,
	"last_refill_at" timestamp,
	"enabled" boolean DEFAULT true,
	"rate_limit_enabled" boolean DEFAULT true,
	"rate_limit_time_window" integer DEFAULT 60000,
	"rate_limit_max" integer DEFAULT 10,
	"request_count" integer DEFAULT 0,
	"remaining" integer,
	"last_request" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"permissions" text,
	"metadata" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"email" text NOT NULL,
	"role" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"inviter_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "jwks" (
	"id" text PRIMARY KEY NOT NULL,
	"public_key" text NOT NULL,
	"private_key" text NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "member" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organization" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text,
	"logo" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"metadata" text,
	CONSTRAINT "organization_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organization_usage" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"period_start" date NOT NULL,
	"period_end" date NOT NULL,
	"total_cost" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"active_organization_id" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "apikey" ADD CONSTRAINT "apikey_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviter_id_user_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "member" ADD CONSTRAINT "member_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "member" ADD CONSTRAINT "member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_usage" ADD CONSTRAINT "organization_usage_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_provider_id_idx" ON "account" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_user_id_provider_id_idx" ON "account" USING btree ("user_id","provider_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "apikey_user_id_idx" ON "apikey" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "apikey_key_idx" ON "apikey" USING btree ("key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "apikey_expires_at_idx" ON "apikey" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "apikey_last_request_idx" ON "apikey" USING btree ("last_request");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "apikey_user_id_enabled_idx" ON "apikey" USING btree ("user_id","enabled");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invitation_email_idx" ON "invitation" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invitation_organization_id_idx" ON "invitation" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invitation_expires_at_idx" ON "invitation" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invitation_status_idx" ON "invitation" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "member_user_id_unique" ON "member" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "member_organization_id_idx" ON "member" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "member_organization_id_role_idx" ON "member" USING btree ("organization_id","role");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "organization_name_idx" ON "organization" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "organization_usage_org_period_unique" ON "organization_usage" USING btree ("organization_id","period_start");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "organization_usage_organization_id_idx" ON "organization_usage" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "organization_usage_period_end_idx" ON "organization_usage" USING btree ("period_end");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_expires_at_idx" ON "session" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_user_id_expires_at_idx" ON "session" USING btree ("user_id","expires_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_email_verified_idx" ON "user" USING btree ("email_verified");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_created_at_idx" ON "user" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "verification_expires_at_idx" ON "verification" USING btree ("expires_at");