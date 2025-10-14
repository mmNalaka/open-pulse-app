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

    c.var.logger.info("Health check performed", {
      status: healthCheck.status,
      responseTime: healthCheck.responseTime,
    });

    return c.json<ApiSuccessResponse>(
      {
        success: true,
        message: HttpStatusCodeMessage.OK,
        data: healthCheck,
      },
      HttpStatusCode.OK
    );
  } catch (error) {
    c.var.logger.error("Health check failed", { error });

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

    c.var.logger.info("Readiness check performed", {
      status: readinessCheck.status,
      responseTime: readinessCheck.responseTime,
    });

    return c.json(readinessCheck, 200);
  } catch (error) {
    c.var.logger.error("Readiness check failed", { error });

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

    c.var.logger.info("Metrics retrieved", {
      responseTime: metrics.responseTime,
    });

    return c.json(metrics, 200);
  } catch (error) {
    c.var.logger.error("Metrics retrieval failed", { error });

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
