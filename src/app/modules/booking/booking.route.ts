import express from "express";
import { BookingControllers } from "./booking.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.const";

const router = express.Router();

router.post(
  "/create-booking",
  // auth(USER_ROLE.USER),
  BookingControllers.createBooking
);

router.get("/", BookingControllers.getAllBookings);

router.get(
  "/user/:email",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  BookingControllers.customerBooking
);

export const BookingRoutes = router;
