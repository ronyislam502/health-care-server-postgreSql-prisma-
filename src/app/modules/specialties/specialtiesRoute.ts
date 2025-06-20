import { Router } from "express";
import { SpecialtiesControllers } from "./specialties.controller";

const router = Router();

router.post("/create-specialties", SpecialtiesControllers.createSpecialties);

export const SpecialtiesRoutes = router;
