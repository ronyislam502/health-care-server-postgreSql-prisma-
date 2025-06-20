import { Router } from "express";
import { DoctorControllers } from "./doctor.controller";

const router = Router();

router.get("/", DoctorControllers.getAllDoctors);

export const DoctorRoutes = router;
