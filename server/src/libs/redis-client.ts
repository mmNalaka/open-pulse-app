import { RedisClient } from "bun";

const url = process.env.REDIS_URL || "redis://localhost:6379";
const redis = new RedisClient(url);

// Auto-connect on initialization
redis.connect().catch((error) => {
  console.error("[Redis] Failed to connect:", error);
});

// Auto-disconnect on process exit
process.on("exit", () => {
  redis.close();
});

process.on("SIGINT", () => {
  redis.close();
  process.exit(0);
});

export { redis };
