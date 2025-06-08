import express from "express";
import { ServiceControllers } from "./service.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.const";
import { multerUpload } from "../../config/multer.config";
import { parseBody } from "../../middlewares/bodyParser";
import { validateRequest } from "../../middlewares/validateRequest";
import { ServiceValidations } from "./service.validation";

const router = express.Router();

router.post(
  "/create-service",
  auth(USER_ROLE.ADMIN),
  multerUpload.single("image"),
  parseBody,
  validateRequest(ServiceValidations.createServiceValidationSchema),
  ServiceControllers.createService
);

router.get("/", ServiceControllers.getAllServices);

router.get("/service/:id", ServiceControllers.getSingleService);

router.patch(
  "/update/:id",
  auth(USER_ROLE.ADMIN),
  multerUpload.single("image"),
  parseBody,
  validateRequest(ServiceValidations.updateServiceValidationSchema),
  ServiceControllers.updateService
);

router.delete(
  "/delete/:id",
  auth(USER_ROLE.ADMIN),
  ServiceControllers.deleteService
);

export const ServiceRoutes = router;
