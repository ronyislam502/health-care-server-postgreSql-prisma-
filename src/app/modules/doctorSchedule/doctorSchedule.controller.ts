import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { DoctorScheduleServices } from "./doctorSchedule.service";
import httpStatus from "http-status";

const createDoctorSchedule = catchAsync(async (req, res) => {
  const result = await DoctorScheduleServices.createDoctorScheduleIntoDB(
    req.user,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor schedule created successfully",
    data: result,
  });
});

const getMySchedule = catchAsync(async (req, res) => {
  const result = await DoctorScheduleServices.getMyScheduleFromDB(
    req.user,
    req.query
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor schedules retrieved successfully",
    data: result,
  });
});

const deleteDoctorSchedule = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DoctorScheduleServices.deleteDoctorScheduleFromDB(
    req.user,
    id
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor schedules deleted successfully",
    data: result,
  });
});

export const DoctorScheduleControllers = {
  createDoctorSchedule,
  getMySchedule,
  deleteDoctorSchedule,
};
