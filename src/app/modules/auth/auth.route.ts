import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { AuthValidations } from "./auth.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post("/login", AuthControllers.loginUser);

router.post("/refresh-token", AuthControllers.refreshToken);

router.post(
  "/change-password",
  auth(UserRole.ADMIN),
  validateRequest(AuthValidations.changePasswordValidationSchema),
  AuthControllers.changePassword
);

router.post(
  "/forgot-password",
  // auth(UserRole.ADMIN),
  AuthControllers.forgotPassword
);

router.post(
  "/reset-password",
  // auth(UserRole.ADMIN),
  AuthControllers.resetPassword
);

export const AuthRoutes = router;
