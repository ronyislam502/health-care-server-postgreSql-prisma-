import { Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { AdminValidations } from "../admin/admin.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { multerUpload } from "../../config/multer.config";
import { parseBody } from "../../middlewares/bodyParser";

const router = Router();

router.post(
  "/create-admin",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  multerUpload.single("image"),
  parseBody,
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserControllers.CreateAdmin
);

router.get("/", UserControllers.getAllUsers);

router.get("/:id", UserControllers.getSingleUser);

router.patch("/:id/status", UserControllers.changeProfileStatus);

router.get("/:email", UserControllers.getMyProfile);

export const UserRoutes = router;
