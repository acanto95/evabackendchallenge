import Router from 'koa-router';
import controller = require('./controller');
import ExplorationsController from './controller/explorations';

const unprotectedRouter = new Router();

// Hello World route
unprotectedRouter.get('/', controller.general.helloWorld);

export { unprotectedRouter };