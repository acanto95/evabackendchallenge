"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const koa_swagger_decorator_1 = require("koa-swagger-decorator");
const protectedRouter = new koa_swagger_decorator_1.SwaggerRouter();
exports.protectedRouter = protectedRouter;
// USER ROUTES
/* protectedRouter.get('/users', controller.user.getUsers);
protectedRouter.get('/users/:id', controller.user.getUser);
protectedRouter.post('/users', controller.user.createUser);
protectedRouter.put('/users/:id', controller.user.updateUser);
protectedRouter.delete('/users/:id', controller.user.deleteUser);
protectedRouter.delete('/testusers', controller.user.deleteTestUsers); */
// Swagger endpoint
protectedRouter.swagger({
    title: 'node-typescript-koa-rest',
    description: 'API REST using NodeJS and KOA framework, typescript. TypeORM for SQL with class-validators. Middlewares JWT, CORS, Winston Logger.',
    version: '1.5.0'
});
// mapDir will scan the input dir, and automatically call router.map to all Router Class
protectedRouter.mapDir(__dirname);
//# sourceMappingURL=protectedRoutes.js.map