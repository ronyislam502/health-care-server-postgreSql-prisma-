import axios from "axios";
import config from "../../config";
import prisma from "../../shared/prisma";
import { initialPayment } from "./payment.utils";

const createPaymentIntoDB = async (appointmentId: string) => {
  const isPayment = await prisma.payment.findFirstOrThrow({
    where: {
      appointmentId,
    },
    include: {
      appointment: {
        include: {
          patient: true,
        },
      },
    },
  });

  //   console.log("is", isPayment);

  const paymentData = {
    amount: isPayment?.amount,
    transactionId: isPayment?.transactionId,
    name: isPayment?.appointment?.patient?.name,
    email: isPayment?.appointment?.patient?.email,
    address: isPayment?.appointment?.patient?.address,
    phone: isPayment?.appointment?.patient?.phone,
  };

  const result = await initialPayment(paymentData);

  //   console.log(result);

  return result;
};

export const PaymentServices = { createPaymentIntoDB };
