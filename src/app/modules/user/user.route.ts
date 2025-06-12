import { Router } from "express";
import { UserControllers } from "./user.controller";

const router=Router()

router.post("/create-admin", UserControllers.CreateAdmin)

router.get("/", UserControllers.getAllUsers);

export const UserRoutes = router;