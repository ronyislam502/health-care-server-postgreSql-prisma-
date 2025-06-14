import { Router } from "express";
import { AuthControllers } from "./auth.controller";

const router = Router();

router.post("/login", AuthControllers.loginUser);

router.post("/refresh-token", AuthControllers.refreshToken);

router.post("/changePassword", AuthControllers.changePassword);

export const AuthRoutes = router;
