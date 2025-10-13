import { pinoLogger as logger } from "hono-pino";
import pino from "pino";

export function pinoLogger() {
  return logger({
    pino: pino({
      level: process.env.LOG_LEVEL || "info",
      transport:
        process.env.NODE_ENV === "production"
          ? undefined
          : {
              target: "pino-pretty",
              options: {
                colorize: true, // Optional: adds colors to logs
              },
            },
    }),
  });
}
