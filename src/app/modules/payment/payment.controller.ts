import catchAsync from "../../utilities/catchAsync";
import { PaymentServices } from "./payment.service";

const paymentConfirm = catchAsync(async (req, res) => {
  const { transactionId, status } = req.query;

  const result = await PaymentServices.confirmPaymentIntoDB(
    transactionId as string,
    status as string
  );

  res.send(result);
});

export const PaymentControllers = {
  paymentConfirm,
};
