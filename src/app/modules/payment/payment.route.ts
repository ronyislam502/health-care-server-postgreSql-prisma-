import { Router } from "express";
import { PaymentControllers } from "./payment.controller";

const router = Router();

router.post(
  "/initial-payment/:appointmentId",
  PaymentControllers.createPayment
);

export const PaymentRoutes = router;
