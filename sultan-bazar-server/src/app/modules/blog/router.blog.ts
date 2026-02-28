import express from 'express';
import { USER_ROLE } from '../auth/const.auth';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { blogControllers } from './controller.blog';

const router = express.Router();

router.post(
  '/create-blog',
  auth(USER_ROLE.user, USER_ROLE.superAdmin),
  // validateRequest(ShoesValidation.CreateShoesValidationSchema),
  blogControllers.createBlog,
);

router.get(
  '/',
  // auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.superAdmin),

  blogControllers.getAllBlogs,
);
// get single
router.get(
  '/:blogId',
  // auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.superAdmin),
  blogControllers.getSingleBlog,
);
// delete
router.delete(
  '/:blogId',
  // auth(USER_ROLE.superAdmin),
  blogControllers.deleteBlogs,
);

router.patch(
  '/:blogId',
  // auth(USER_ROLE.seller, USER_ROLE.superAdmin),
  // validateRequest(ShoesValidation.UpdateShoesValidationSchema),
  blogControllers.updateBlog,
);



export const blogRoutes = router;
