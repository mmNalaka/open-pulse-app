import type { Context } from "hono";
import { HttpStatusCode } from "shared/dist/http-status-code";
import { HttpStatusCodeMessage } from "shared/dist/http-status-messages";
import type { ApiErrorResponse, ApiSuccessResponse } from "shared/dist/types/response.types";
import type { AppBindings } from "../../app";

// Health check - basic service availability
const healthHandler = (c: Context<AppBindings>): Response => {
  const startTime = Date.now();

  try {
    // Basic health check - could be extended to check database, external services, etc.
    const healthCheck = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: Date.now() - startTime,
    };

    c.var.logger.info(
      {
        status: healthCheck.status,
        responseTime: healthCheck.responseTime,
      },
      "Health check performed"
    );

    return c.json<ApiSuccessResponse<typeof healthCheck>>(
      {
        success: true,
        message: HttpStatusCodeMessage.OK,
        data: healthCheck,
      },
      HttpStatusCode.OK
    );
  } catch (error) {
    c.var.logger.error({ error }, "Health check failed");

    return c.json<ApiErrorResponse>(
      {
        success: false,
        message: HttpStatusCodeMessage.SERVICE_UNAVAILABLE,
        details: "Service is currently unavailable",
      },
      HttpStatusCode.SERVICE_UNAVAILABLE
    );
  }
};

// Readiness check - service readiness for traffic
const readyHandler = (c: Context<AppBindings>): Response => {
  const startTime = Date.now();

  try {
    // Readiness check - could be extended to check database connections, external dependencies, etc.
    const readinessCheck = {
      status: "ready",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: Date.now() - startTime,
    };

    c.var.logger.info(
      {
        status: readinessCheck.status,
        responseTime: readinessCheck.responseTime,
      },
      "Readiness check performed"
    );

    return c.json(readinessCheck, 200);
  } catch (error) {
    c.var.logger.error({ error }, "Readiness check failed");

    return c.json(
      {
        status: "not ready",
        timestamp: new Date().toISOString(),
        error: "Service not ready",
      },
      503
    );
  }
};

// Metrics endpoint - basic system metrics
const metricsHandler = (c: Context<AppBindings>): Response => {
  const startTime = Date.now();

  try {
    const metrics = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      responseTime: Date.now() - startTime,
    };

    c.var.logger.info(
      {
        responseTime: metrics.responseTime,
      },
      "Metrics retrieved"
    );

    return c.json(metrics, 200);
  } catch (error) {
    c.var.logger.error({ error }, "Metrics retrieval failed");

    return c.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: "Failed to retrieve metrics",
      },
      500
    );
  }
};

export { healthHandler, readyHandler, metricsHandler };
