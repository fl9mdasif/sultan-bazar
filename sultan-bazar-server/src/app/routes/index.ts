import { Router } from 'express';
import { authRoute } from '../modules/auth/route.auth';
import { ImageUploads } from '../modules/upload/route.upload';
import { categoryRoutes } from '../modules/category/router.category';

const router = Router();

const moduleRoute = [
  {
    path: '/auth',
    route: authRoute,
  },
  // {
  //   path: '/projects',
  //   route: projectRoutes,
  // },


  {
    path: '/categories',
    route: categoryRoutes,
  },
];

moduleRoute.forEach((routeObj) => router.use(routeObj.path, routeObj.route));

export default router;
