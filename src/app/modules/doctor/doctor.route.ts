import { Router } from "express";
import { DoctorControllers } from "./doctor.controller";

const router = Router();

router.get("/", DoctorControllers.getAllDoctors);

router.get("/:id", DoctorControllers.getSingleDoctor);

export const DoctorRoutes = router;
