import { Router } from "express";
import { PatientControllers } from "./patient.controller";

const router = Router();

router.get("/", PatientControllers.getAllPatients);

export const PatientRoutes = router;
