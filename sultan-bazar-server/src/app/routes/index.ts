import { Router } from 'express';
import { authRoute } from '../modules/auth/route.auth';
import { categoryRoutes } from '../modules/category/router.category';
import { productRoutes } from '../modules/product/router.product';

const router = Router();

const moduleRoute = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/categories',
    route: categoryRoutes,
  },
  {
    path: '/products',
    route: productRoutes,
  },
];

moduleRoute.forEach((routeObj) => router.use(routeObj.path, routeObj.route));

export default router;
