import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.const";
import { validateRequest } from "../../middlewares/validateRequest";
import { ReviewValidations } from "./review.validation";
import { ReviewControllers } from "./review.controller";

const router = Router();

router.post(
  "/create-review",
  auth(USER_ROLE.USER),
  validateRequest(ReviewValidations.createReviewValidationSchema),
  ReviewControllers.createReview
);

router.patch(
  "/update/:id",
  auth(USER_ROLE.USER),
  ReviewControllers.updateReview
);

router.get("/", ReviewControllers.getAllReviews);

router.get("/service/:id", ReviewControllers.getSingleServiceReviews);

export const ReviewRoutes = router;
