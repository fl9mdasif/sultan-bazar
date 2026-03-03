import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { response } from '../../utils/sendResponse';
import { userServices } from './service.user';

// GET /api/v1/users/addresses
const getAddresses = catchAsync(async (req, res) => {
    const result = await userServices.getAddresses(req.user.userId);
    response.createSendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Saved addresses retrieved successfully',
        data: result,
    });
});

// POST /api/v1/users/addresses
const addAddress = catchAsync(async (req, res) => {
    const result = await userServices.addAddress(req.user.userId, req.body);
    response.createSendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Address added successfully',
        data: result,
    });
});

// PATCH /api/v1/users/addresses/:id
const updateAddress = catchAsync(async (req, res) => {
    const result = await userServices.updateAddress(
        req.user.userId,
        req.params.id,
        req.body,
    );
    response.createSendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Address updated successfully',
        data: result,
    });
});

// DELETE /api/v1/users/addresses/:id
const deleteAddress = catchAsync(async (req, res) => {
    const result = await userServices.deleteAddress(req.user.userId, req.params.id);
    response.createSendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Address deleted successfully',
        data: result,
    });
});

// PATCH /api/v1/users/addresses/:id/default
const setDefaultAddress = catchAsync(async (req, res) => {
    const result = await userServices.setDefaultAddress(req.user.userId, req.params.id);
    response.createSendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Default address updated',
        data: result,
    });
});

export const userControllers = {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
};
