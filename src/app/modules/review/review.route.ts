import { Router } from "express";
import { ReviewControllers } from "./review.controller";

const router = Router();

router.post("/create-review", ReviewControllers.createReview);

export const ReviewRoutes = router;
