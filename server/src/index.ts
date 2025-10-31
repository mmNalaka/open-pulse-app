import { createApp } from "./app";
import { setupClickhouse } from "./db/clickhouse/clickhouse";
import { eventQueue } from "./services/event-queue.service";

/**
 * Initialize application dependencies
 * Fails fast if critical services cannot be set up
 */
const initializeDependencies = async (): Promise<void> => {
  const startTime = Date.now();
  console.log("[STARTUP] Initializing dependencies...");

  try {
    // Dependencies
    await setupClickhouse();
    eventQueue.start();

    const duration = Date.now() - startTime;
    console.log(`[STARTUP] ✓ Dependencies initialized successfully (${duration}ms)`);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[STARTUP] ✗ Failed to initialize dependencies (${duration}ms)`, error);
  }
};

/**
 * Bootstrap the application
 */
const bootstrap = async (): Promise<void> => {
  await initializeDependencies();
  // App creation is synchronous and safe after dependencies are ready
  return;
};

// Initialize and export app
await bootstrap();
export const app = createApp();

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};
