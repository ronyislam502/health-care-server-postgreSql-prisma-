import { Router } from "express";
import { DoctorScheduleControllers } from "./doctorSchedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/create-doctor-schedule",
  auth(UserRole.DOCTOR),
  DoctorScheduleControllers.createDoctorSchedule
);

router.get(
  "/get-my-schedule",
  auth(UserRole.DOCTOR),
  DoctorScheduleControllers.getMySchedule
);

export const DoctorScheduleRoutes = router;
