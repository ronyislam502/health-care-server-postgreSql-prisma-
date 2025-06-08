/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TBooking } from "./booking.interface";
import { Service } from "../service/service.model";
import { Slot } from "../slot/slot.model";
import { Booking } from "./booking.model";
import QueryBuilder from "../../builder/queryBuilder";
import { search } from "./booking.const";
import { TPayment } from "../payment/payment.interface";
import { initiatePayment } from "../payment/payment.utils";

const createBookingIntoDB = async (payload: TBooking) => {
  try {
    const customer = await User.findById(payload?.user);

    if (!customer) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const isServiceExists = await Service.findById(payload.service);
    if (!isServiceExists) {
      throw new AppError(httpStatus.NOT_FOUND, "service not found");
    }

    const isSlotExists = await Slot.findById(payload.slot);
    if (!isSlotExists) {
      throw new AppError(httpStatus.NOT_FOUND, "slot not found");
    }

    const isSlotBooked = isSlotExists.isBooked === "booked";

    if (isSlotBooked) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "slot not available at this time"
      );
    }

    const tax = parseFloat((isServiceExists.price * 0.1).toFixed(2));
    const grandAmount = parseFloat((isServiceExists.price + tax).toFixed(2));

    const transactionId = `TXN-${Date.now()}`;

    const booking = new Booking({
      user: customer,
      service: isServiceExists,
      slot: isSlotExists,
      vehicleType: payload.vehicleType,
      vehicleBrand: payload.vehicleBrand,
      vehicleModel: payload.vehicleModel,
      manufacturingYear: payload.manufacturingYear,
      registrationPlate: payload.registrationPlate,
      tax,
      grandAmount,
      status: "Pending",
      paymentStatus: "Pending",
      transactionId,
    });

    await booking.save();

    const paymentData: TPayment = {
      transactionId,
      user: customer?._id,
      grandAmount,
    };

    const payment = await initiatePayment(paymentData);

    return payment;
  } catch (error: any) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      `Order creation failed: ${error?.message}`
    );
  }
};

const getAllBookingsFromDB = async (query: Record<string, unknown>) => {
  const bookingQuery = new QueryBuilder(
    Booking.find()
      .populate("user", "name email address phone")
      .populate("service", "title duration price")
      .populate("slot"),
    query
  )
    .search(search)
    .filter()
    .fields()
    .sort()
    .paginate();

  const meta = await bookingQuery.countTotal();
  const data = await bookingQuery.modelQuery;

  return { meta, data };
};

const getCustomerBookingFromDB = async (
  email: string,
  query: Record<string, unknown>
) => {
  const user = await User.find({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found");
  }

  const orderQuery = new QueryBuilder(
    Booking.find({ user })
      .populate("user", "name phone address email")
      .populate("service", "title duration price image")
      .populate("slot"),
    query
  )
    .search(search)
    .filter()
    .fields()
    .sort()
    .paginate();

  const meta = await orderQuery.countTotal();
  const data = await orderQuery.modelQuery;

  return { meta, data };
};

export const BookingServices = {
  createBookingIntoDB,
  getAllBookingsFromDB,
  getCustomerBookingFromDB,
};
