import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { authValidations } from './validation.auth';
import { authControllers } from './controller.auth';

const router = express.Router();

// register a user
router.post(
  '/register',
  validateRequest(authValidations.userRegistrationValidation),
  authControllers.registerUser,
);

// login a user
router.post(
  '/login',
  // validateRequest(authValidations.loginValidationSchema),
  authControllers.loginUser,
);

// change password
router.post(
  '/change-password',
  // validateRequest(authValidations.changePasswordValidationSchema),
  authControllers.changePassword,
);

// refresh token
router.post('/refresh-token', authControllers.refreshToken);


export const authRoute = router;
