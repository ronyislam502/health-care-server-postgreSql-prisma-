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
  multerUpload.single("image"),
  parseBody,
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserControllers.CreateAdmin
);

router.get("/", auth(UserRole?.ADMIN), UserControllers.getAllUsers);

router.get("/:id", UserControllers.getSingleUser);

export const UserRoutes = router;
