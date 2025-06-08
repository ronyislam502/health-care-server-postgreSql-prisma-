import express from "express";
import { UserControllers } from "../user/user.controller";
import { AuthControllers } from "./auth.controller";
import { multerUpload } from "../../config/multer.config";
import { parseBody } from "../../middlewares/bodyParser";
import {
  validateRequest,
  validateRequestCookies,
} from "../../middlewares/validateRequest";
import { UserValidations } from "../user/user.validation";
import { AuthValidations } from "./auth.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.const";

const router = express.Router();

router.post(
  "/signup",
  multerUpload.single("avatar"),
  parseBody,
  validateRequest(UserValidations.createUserValidationSchema),
  UserControllers.createUser
);

router.post(
  "/login",
  validateRequest(AuthValidations.loginValidationSchema),
  AuthControllers.loginUser
);

router.post(
  "/change-password",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  validateRequest(AuthValidations.changePasswordValidationSchema),
  AuthControllers.changePassword
);

router.post(
  "/refresh-token",
  validateRequestCookies(AuthValidations.refreshTokenValidationSchema),
  AuthControllers.refreshToken
);

export const AuthRoutes = router;
