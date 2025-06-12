import { Router } from "express";
import { UserControllers } from "./user.controller";

const router=Router()

router.post("/create-admin", UserControllers.CreateAdmin)

export const UserRoutes=router;