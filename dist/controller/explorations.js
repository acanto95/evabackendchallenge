"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const explorations_1 = require("../entity/explorations");
class ExplorationsController {
    static async getExplorations(ctx) {
        const explorationRepo = typeorm_1.getManager().getRepository(explorations_1.Explorations);
        const query = {};
        /* if (schema && schema !== 'all') {
          query['schema'] = schema;
        } */
        const explorations = await explorationRepo.find();
        ctx.status = 200;
        ctx.body = explorations;
    }
}
exports.default = ExplorationsController;
//# sourceMappingURL=explorations.js.map