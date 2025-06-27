import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ReviewServices } from "./review.service";

const createReview = catchAsync(async (req, res) => {
  const result = await ReviewServices.createReviewIntoDB(req.user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

export const ReviewControllers = {
  createReview,
};
