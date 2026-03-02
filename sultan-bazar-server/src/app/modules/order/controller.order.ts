import catchAsync from "../../utils/catchAsync";
import { response } from "../../utils/sendResponse";
import httpStatus from 'http-status';
// import { OrderServices } from './service.order';

const createOrder = catchAsync(async (req, res) => {
    const result = await OrderServices.createOrder(req.body);

    response.createSendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Order created successfully',
        data: result,
    });
});