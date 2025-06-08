import express from "express";
import { SlotControllers } from "./slot.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.const";
import { validateRequest } from "../../middlewares/validateRequest";
import { SlotValidations } from "./slot.validation";

const router = express.Router();

router.post(
  "/create-slot",
  auth(USER_ROLE.ADMIN),
  validateRequest(SlotValidations.createSlotValidationSchema),
  SlotControllers.createSlot
);

router.get("/service/:id", SlotControllers.getSlotsByService);

router.get("/", SlotControllers.getAllSlots);

router.get("/slot/:id", SlotControllers.getSingleSlot);

router.get("/availability", SlotControllers.getAvailableSlots);

export const SlotRoutes = router;
