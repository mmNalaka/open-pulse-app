CREATE TABLE "active_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"site_id" text NOT NULL,
	"user_id" text,
	"start_time" timestamp DEFAULT now() NOT NULL,
	"last_activity" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "active_sessions_session_id_unique" UNIQUE("session_id")
);
--> statement-breakpoint
ALTER TABLE "active_sessions" ADD CONSTRAINT "active_sessions_site_id_site_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "active_sessions_site_id_idx" ON "active_sessions" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX "active_sessions_session_id_idx" ON "active_sessions" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "active_sessions_last_activity_idx" ON "active_sessions" USING btree ("last_activity");--> statement-breakpoint
CREATE INDEX "active_sessions_is_active_idx" ON "active_sessions" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "active_sessions_site_id_is_active_idx" ON "active_sessions" USING btree ("site_id","is_active");