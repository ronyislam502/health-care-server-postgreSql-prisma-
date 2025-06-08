import httpStatus from "http-status";
import catchAsync from "../../utilities/catchAsync";
import sendResponse from "../../utilities/sendResponse";
import { StatisticsServices } from "./statistics.service";

const statistics = catchAsync(async (req, res) => {
  const result = await StatisticsServices.getServiceAndCategoryStatistics();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Statistics",
    data: result,
  });
});

const popularServices = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 5;
  const result = await StatisticsServices.getPopularServices(limit);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Popular services successfully",
    data: result,
  });
});

export const StatisticsControllers = {
  statistics,
  popularServices,
};
