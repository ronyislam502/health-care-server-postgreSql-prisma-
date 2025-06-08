import { Router } from "express";
import { StatisticsControllers } from "./statistics.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.const";

const router = Router();

router.get("/stats", auth(USER_ROLE.ADMIN), StatisticsControllers.statistics);

router.get("/popular-services", StatisticsControllers.popularServices);

export const StatisticsRoutes = router;
