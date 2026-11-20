import express from 'express';
import authorize from '../../middlewares/authorize';
import validateRequest from '../../middlewares/validateRequest';
import { userControllers } from './controller.user';
import { userValidations } from './validation.user';

const router = express.Router();

// ── Address routes (user / admin / superAdmin) ────────────────────────────────

// GET all saved addresses
router.get(
    '/addresses',
    authorize('manageOwnAccount'),
    userControllers.getAddresses,
);

// POST add a new address
router.post(
    '/addresses',
    authorize('manageOwnAccount'),
    validateRequest(userValidations.addAddressValidation),
    userControllers.addAddress,
);

// PATCH update a specific address
router.patch(
    '/addresses/:id',
    authorize('manageOwnAccount'),
    validateRequest(userValidations.updateAddressValidation),
    userControllers.updateAddress,
);

// PATCH set an address as default
router.patch(
    '/addresses/:id/default',
    authorize('manageOwnAccount'),
    userControllers.setDefaultAddress,
);

// DELETE remove an address
router.delete(
    '/addresses/:id',
    authorize('manageOwnAccount'),
    userControllers.deleteAddress,
);

// ── Superadmin: User management routes ────────────────────────────────────────

// GET  /api/v1/users          — list all users (search, role, page, limit)
router.get(
    '/',
    authorize('listUsers'),
    userControllers.getAllUsers,
);

// ── Profile routes (all authenticated roles) ───────────────────────────────────

// GET  /api/v1/users/me
router.get(
    '/me',
    authorize('manageOwnAccount'),
    userControllers.getMyProfile,
);

// PATCH /api/v1/users/me
router.patch(
    '/me',
    authorize('manageOwnAccount'),
    userControllers.updateProfile,
);

// POST /api/v1/users/me/change-password
router.post(
    '/me/change-password',
    authorize('manageOwnAccount'),
    userControllers.changePassword,
);

// PATCH /api/v1/users/:id/role   — change a user's role
router.patch(
    '/:id/role',
    authorize('manageUserRoles'),
    validateRequest(userValidations.updateUserRoleValidation),
    userControllers.updateUserRole,
);

// PATCH /api/v1/users/:id/block  — toggle block/unblock
router.patch(
    '/:id/block',
    authorize('manageUserBlocks'),
    userControllers.toggleBlockUser,
);

// DELETE /api/v1/users/:id       — permanently delete a user
router.delete(
    '/:id',
    authorize('deleteUsers'),
    userControllers.deleteUser,
);

export const userRoutes = router;
