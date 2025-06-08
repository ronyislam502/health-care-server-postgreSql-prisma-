import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TReview } from "./review.interface";
import { Service } from "../service/service.model";
import { Review } from "./review.model";
import QueryBuilder from "../../builder/queryBuilder";
import { Booking } from "../booking/booking.model";

const createReviewIntoDB = async (payload: TReview) => {
  const isUserExists = await User.findById(payload?.user);

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const isBooking = await Booking.findById(payload?.booking);

  if (!isBooking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  const isService = await Service.findById(payload?.service);

  if (!isService) {
    throw new AppError(httpStatus.NOT_FOUND, "Service not found");
  }

  const review = await Review.create(payload);

  const result = await review.populate([
    { path: "user", select: "name email" },
    { path: "booking", select: "transactionId" },
    { path: "service", select: "title" },
  ]);

  return result;
};

const getAllReviewsFromDB = async (query: Record<string, unknown>) => {
  const reviewQuery = new QueryBuilder(
    Review.find()
      .populate("user", "name email")
      .populate("service", "title duration")
      .populate("booking", "transactionId"),
    query
  )
    .filter()
    .fields()
    .sort()
    .paginate();

  const meta = await reviewQuery.countTotal();
  const data = await reviewQuery.modelQuery;

  const totalRatings = data?.reduce((sum, review) => sum + review.rating, 0);
  const averageRating =
    data.length > 0 ? (totalRatings / data.length).toFixed(2) : "0.00";

  return {
    meta,
    data,
    averageRating,
    totalRatings,
  };
};

const updateReviewFromDB = async (id: string, payload: Partial<TReview>) => {
  // find review
  const isReview = await Review.findById(id);

  if (!isReview) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found");
  }

  const isBooking = isReview?.booking;

  if (!isBooking) {
    throw new AppError(httpStatus.NOT_FOUND, "Service not found");
  }

  //   check user

  const isUser = isReview?.user;

  if (!isUser) {
    throw new AppError(httpStatus.NOT_FOUND, "Service not found");
  }

  //   check service
  const isService = isReview?.service;

  if (!isService) {
    throw new AppError(httpStatus.NOT_FOUND, "Service not found");
  }

  const result = await Review.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const getSingleServiceReviewsFromDB = async (
  id: string,
  query: Record<string, unknown>
) => {
  // const data = await Review.find({ service: id })
  //   .populate("user", "name email")
  //   .populate("service", "title");

  const queryServiceReviews = new QueryBuilder(
    Review.find({ service: id })
      .populate("user", "name email")
      .populate("service", "title"),
    query
  ).paginate();

  const meta = await queryServiceReviews.countTotal();
  const data = await queryServiceReviews.modelQuery;

  const totalRatings = data?.reduce((sum, review) => sum + review.rating, 0);
  const averageRating =
    data.length > 0 ? (totalRatings / data.length).toFixed(2) : "0.00";

  return {
    meta,
    data,
    averageRating,
    totalRatings,
  };
};

export const ReviewServices = {
  createReviewIntoDB,
  getAllReviewsFromDB,
  updateReviewFromDB,
  getSingleServiceReviewsFromDB,
};
