"use strict";

const newrelic = require("newrelic");

const newRelicMiddleware = (req, res, next) => {
  newrelic.addCustomAttribute("endpoint", req.path);
  newrelic.addCustomAttribute("method", req.method);
  newrelic.addCustomAttribute("userAgent", req.get("User-Agent"));
  newrelic.addCustomAttribute("ip", req.ip);

  if (Object.keys(req.query).length > 0) {
    newrelic.addCustomAttribute("queryParams", JSON.stringify(req.query));
  }

  const startTime = Date.now();

  res.on("finish", () => {
    const responseTime = Date.now() - startTime;
    newrelic.addCustomAttribute("responseTime", responseTime);
    newrelic.addCustomAttribute("statusCode", res.statusCode);

    newrelic.recordMetric("Custom/ResponseTime", responseTime);
    newrelic.recordMetric("Custom/StatusCodes/" + res.statusCode, 1);
  });

  next();
};

/**
 * Função para registrar erros customizados
 */
const recordCustomError = (error, customAttributes = {}) => {
  newrelic.noticeError(error, customAttributes);
};

/**
 * Função para registrar eventos customizados
 */
const recordCustomEvent = (eventType, attributes = {}) => {
  newrelic.recordCustomEvent(eventType, attributes);
};

/**
 * Função para registrar métricas customizadas
 */
const recordCustomMetric = (name, value) => {
  newrelic.recordMetric(name, value);
};

/**
 * Função para iniciar segmentos customizados
 */
const startCustomSegment = (name, callback) => {
  return newrelic.startSegment(name, true, callback);
};

module.exports = {
  newRelicMiddleware,
  recordCustomError,
  recordCustomEvent,
  recordCustomMetric,
  startCustomSegment,
};
