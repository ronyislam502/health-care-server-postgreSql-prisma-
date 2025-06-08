/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import config from "../../config";
import dotenv from "dotenv";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { TPayment } from "./payment.interface";
import { User } from "../user/user.model";

dotenv.config();

export const initiatePayment = async (paymentData: TPayment) => {
  const customer = await User.findById(paymentData?.user);

  try {
    const response = await axios.post(config?.payment_url as string, {
      store_id: config.store_id,
      signature_key: config.signature_key,
      tran_id: paymentData?.transactionId,
      success_url: `${config.live_url_server}/api/payment/confirm?transactionId=${paymentData?.transactionId}& status=success`,
      fail_url: `${config.live_url_server}/api/payment/confirm?status=failed`,
      cancel_url: config?.client_live_url_page,
      desc: "Merchant Registration Payment",
      amount: paymentData?.grandAmount,
      currency: "BDT",
      cus_name: customer?.name,
      cus_email: customer?.email,
      cus_phone: customer?.phone,
      cus_add1: customer?.address,
      cus_add2: "N/A",
      cus_city: "N/A",
      cus_state: "N/A",
      cus_postcode: "N/A",
      cus_country: "USA",
      type: "json",
    });

    return response?.data?.payment_url;
  } catch (err) {
    throw new AppError(httpStatus.FORBIDDEN, "Payment initiation failed!");
  }
};

export const verifyPayment = async (transactionId: string) => {
  const response = await axios.get(config?.payment_verify_url as string, {
    params: {
      store_id: config.store_id,
      signature_key: config.signature_key,
      request_id: transactionId,
      type: "json",
    },
  });

  return response?.data;
};
