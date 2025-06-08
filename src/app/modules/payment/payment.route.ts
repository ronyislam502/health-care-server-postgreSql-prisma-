import { Router } from "express";
import { PaymentControllers } from "./payment.controller";

const router = Router();

router.post("/confirm", PaymentControllers.paymentConfirm);

export const PaymentRoutes = router;
