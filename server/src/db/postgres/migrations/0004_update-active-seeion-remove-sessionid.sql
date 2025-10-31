ALTER TABLE "active_sessions" DROP CONSTRAINT "active_sessions_session_id_unique";--> statement-breakpoint
DROP INDEX "active_sessions_session_id_idx";--> statement-breakpoint
ALTER TABLE "active_sessions" DROP COLUMN "session_id";