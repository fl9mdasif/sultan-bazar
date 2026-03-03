import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../auth/const.auth';
import { userControllers } from './controller.user';
import { userValidations } from './validation.user';

const router = express.Router();

// All routes require the user to be authenticated
router.use(auth(USER_ROLE.user, USER_ROLE.superAdmin));

// GET all saved addresses
router.get('/addresses',
    auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
    userControllers.getAddresses);

// POST add a new address
router.post(
    '/addresses',
    auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
    validateRequest(userValidations.addAddressValidation),
    userControllers.addAddress,
);

// PATCH update a specific address
router.patch(
    '/addresses/:id',
    auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
    validateRequest(userValidations.updateAddressValidation),
    userControllers.updateAddress,
);

// PATCH set an address as default
router.patch('/addresses/:id/default',
    auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
    userControllers.setDefaultAddress);

// DELETE remove an address
router.delete('/addresses/:id',
    auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
    userControllers.deleteAddress);

export const userRoutes = router;
