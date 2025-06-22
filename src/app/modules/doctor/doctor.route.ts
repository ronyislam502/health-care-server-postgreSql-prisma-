import { Router } from "express";
import { DoctorControllers } from "./doctor.controller";
import { multerUpload } from "../../config/multer.config";
import { parseBody } from "../../middlewares/bodyParser";

const router = Router();

router.get("/", DoctorControllers.getAllDoctors);

router.get("/:id", DoctorControllers.getSingleDoctor);

router.patch("/:id", DoctorControllers.updateDoctor);

router.delete("/:id", DoctorControllers.deleteDoctor);

export const DoctorRoutes = router;
