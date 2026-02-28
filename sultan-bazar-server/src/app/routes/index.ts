import { Router } from 'express';
import { authRoute } from '../modules/auth/route.auth';
// import { projectRoutes } from '../modules/projects/route.projects';
import { blogRoutes } from '../modules/blog/router.blog';
import { ImageUploads } from '../modules/upload/route.upload';

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
    path: '/blogs',
    route: blogRoutes,
  }
];

moduleRoute.forEach((routeObj) => router.use(routeObj.path, routeObj.route));

export default router;
