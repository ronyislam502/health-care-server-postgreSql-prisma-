import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { PaymentServices } from "./payment.service";
import httpStatus from "http-status";

const createPayment = catchAsync(async (req, res) => {
  const { transactionId } = req.params;
  const result = await PaymentServices.createPaymentIntoDB(transactionId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment successfully",
    data: result,
  });
});

export const PaymentControllers = { createPayment };
