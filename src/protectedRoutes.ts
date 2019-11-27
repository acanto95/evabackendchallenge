import { SwaggerRouter } from 'koa-swagger-decorator';
import controller = require('./controller');

const protectedRouter = new SwaggerRouter();

protectedRouter.get('/explorations', controller.explorations.getExplorations);

protectedRouter.mapDir(__dirname);

export { protectedRouter };