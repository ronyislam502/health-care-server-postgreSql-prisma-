import { Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { AdminValidations } from "../admin/admin.validation";

const router = Router();

router.post(
  "/create-admin",
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserControllers.CreateAdmin
);

router.get("/", UserControllers.getAllUsers);

router.get("/:id", UserControllers.getSingleUser);

export const UserRoutes = router;
