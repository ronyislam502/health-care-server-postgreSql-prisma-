import { Router } from "express";
import { PatientControllers } from "./patient.controller";

const router = Router();

router.get("/", PatientControllers.getAllPatients);

router.get("/:id", PatientControllers.getSinglePatient);

router.patch("/:id", PatientControllers.updatePatient);

router.delete("/:id", PatientControllers.deletePatient);

export const PatientRoutes = router;
