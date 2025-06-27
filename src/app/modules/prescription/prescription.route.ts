import { Router } from "express";
import { PrescriptionControllers } from "./prescription.controller";

const router = Router();

router.post("/create-prescription", PrescriptionControllers.createPrescription);

router.get("/", PrescriptionControllers.getAllPrescriptions);

router.get("/patient", PrescriptionControllers.getPatientPrescriptions);

export const PrescriptionRoutes = router;
