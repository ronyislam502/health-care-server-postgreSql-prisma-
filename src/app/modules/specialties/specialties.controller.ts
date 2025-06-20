import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { SpecialtiesServices } from "./specialties.service";
import httpStatus from "http-status";

const createSpecialties = catchAsync(async (req, res) => {
  const result = await SpecialtiesServices.createSpecialtiesIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialties created Successfully",
    data: result,
  });
});

export const SpecialtiesControllers = { createSpecialties };
