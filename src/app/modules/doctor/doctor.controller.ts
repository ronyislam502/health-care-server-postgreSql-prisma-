import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { DoctorServices } from "./doctor.service";
import httpStatus from "http-status";

const getAllDoctors = catchAsync(async (req, res) => {
  const result = await DoctorServices.getAllDoctorsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctors retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const DoctorControllers = {
  getAllDoctors,
};
