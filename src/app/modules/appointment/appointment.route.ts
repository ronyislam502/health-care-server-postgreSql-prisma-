import { Router } from "express";
import { AppointmentControllers } from "./appointment.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/create-appointment",
  auth(UserRole.PATIENT),
  AppointmentControllers.createAppointment
);

router.get(
  "/my-appointments",
  auth(UserRole.PATIENT, UserRole.DOCTOR),
  AppointmentControllers.getMyAppointment
);

router.get("/", auth(UserRole.PATIENT), AppointmentControllers.allAppointments);

export const AppointmentRoutes = router;
