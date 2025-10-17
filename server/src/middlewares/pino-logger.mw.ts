import { pinoLogger as honoLogger } from "hono-pino";
import { logger } from "@/libs/logger";

export function pinoLogger() {
  return honoLogger({ pino: logger });
}
