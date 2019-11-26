"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cron_1 = require("cron");
const config_1 = require("./config");
const cron = new cron_1.CronJob(config_1.config.cronJobExpression, () => {
    console.log('Executing cron job once every hour');
});
exports.cron = cron;
//# sourceMappingURL=cron.js.map