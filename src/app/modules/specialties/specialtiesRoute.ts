import { Router } from "express";
import { SpecialtiesControllers } from "./specialties.controller";

const router = Router();

router.post("/create-specialties", SpecialtiesControllers.createSpecialties);

router.get("/", SpecialtiesControllers.getAllSpecialties);

router.get("/:id", SpecialtiesControllers.deleteSpecialties);

export const SpecialtiesRoutes = router;
