"use strict";

exports.config = {
  app_name: ["Death Star API"],
  license_key: "dc8629336ac5d2406c5c09ad34122eceFFFFNRAL",

  agent_enabled: true,
  enabled: true,

  logging: {
    level: "info",
    enabled: true,
  },

  host: "collector.newrelic.com",
  port: 443,

  proxy: {
    enabled: false,
  },

  ssl: true,

  timeout: 30000,

  distributed_tracing: {
    enabled: true,
  },

  allow_all_headers: true,

  application_logging: {
    forwarding: {
      enabled: true,
    },
  },

  attributes: {
    exclude: [
      "request.headers.cookie",
      "request.headers.authorization",
      "request.headers.proxyAuthorization",
      "request.headers.setCookie*",
      "request.headers.x*",
      "response.headers.cookie",
      "response.headers.authorization",
      "response.headers.proxyAuthorization",
      "response.headers.setCookie*",
      "response.headers.x*",
    ],
  },

  transaction_tracer: {
    enabled: true,
    transaction_threshold: 5,
    record_sql: "obfuscated",
    stack_trace_threshold: 0.5,
    explain_threshold: 0.5,
  },

  error_collector: {
    enabled: true,
    ignore_status_codes: [404, 401, 403],
  },

  browser_monitoring: {
    auto_instrument: true,
  },

  transaction_events: {
    attributes: {
      exclude: [
        "request.headers.cookie",
        "request.headers.authorization",
        "request.headers.proxyAuthorization",
        "request.headers.setCookie*",
        "request.headers.x*",
        "response.headers.cookie",
        "response.headers.authorization",
        "response.headers.proxyAuthorization",
        "response.headers.setCookie*",
        "response.headers.x*",
      ],
    },
  },

  custom_instrumentation: {
    enabled: true,
  },
};
