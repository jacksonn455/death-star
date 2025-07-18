"use strict";

process.env.NEW_RELIC_HOME = __dirname;
process.env.NEW_RELIC_APP_NAME = "Death Star API";
process.env.NEW_RELIC_LICENSE_KEY = "dc8629336ac5d2406c5c09ad34122eceFFFFNRAL";
process.env.NEW_RELIC_ENABLED = "true";

const newrelic = require("newrelic");

if (newrelic.agent && newrelic.agent.config) {
  newrelic.agent.config.enabled = true;
  newrelic.agent.config.agent_enabled = true;
}

module.exports = newrelic;
