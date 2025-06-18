import { Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { AdminValidations } from "../admin/admin.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { multerUpload } from "../../config/multer.config";
import { parseBody } from "../../middlewares/bodyParser";
import { DoctorValidations } from "../doctor/doctor.validation";

const router = Router();

router.post(
  "/create-admin",
  // auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  multerUpload.single("image"),
  parseBody,
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserControllers.CreateAdmin
);

router.post(
  "/create-doctor",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  multerUpload.single("image"),
  parseBody,
  validateRequest(DoctorValidations.createDoctorSchema),
  UserControllers.CreateDoctor
);

router.get("/", UserControllers.getAllUsers);

router.get("/:id", UserControllers.getSingleUser);

router.patch("/:id/status", UserControllers.changeProfileStatus);

router.get(
  "/:email",
  auth(UserRole.ADMIN, UserRole.DOCTOR),
  UserControllers.getMyProfile
);

export const UserRoutes = router;
