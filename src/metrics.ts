import expressPromBundle from "express-prom-bundle";

export const metricsMiddleware = expressPromBundle({
  includeMethod: true,
  includePath: true,
  promClient: {
    collectDefaultMetrics: {}
  }
});
