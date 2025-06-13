import { Router } from "express";
import { AdminControllers } from "./admin.controller";

const router = Router();

router.get("/", AdminControllers.getAllAdmins);

router.get("/:id", AdminControllers.getSingleAdmin);

router.patch("/update/:id", AdminControllers.updateAdmin);

router.delete("/delete/:id", AdminControllers.deleteAdmin);

export const AdminRoutes = router;
