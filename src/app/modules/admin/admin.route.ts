import { Router } from "express";
import { AdminControllers } from "./admin.controller";

const router=Router();

router.get("/", AdminControllers.getAllAdmins)

export const AdminRoutes=router;