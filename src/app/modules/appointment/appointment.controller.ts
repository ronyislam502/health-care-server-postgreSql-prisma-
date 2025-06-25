import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AppointmentServices } from "./appointment.service";
import httpStatus from "http-status";

const createAppointment = catchAsync(async (req, res) => {
  const result = await AppointmentServices.createAppointmentIntoDB(
    req.user,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Created appointment successfully",
    data: result,
  });
});

const getMyAppointment = catchAsync(async (req, res) => {
  const result = await AppointmentServices.getMyAppointmentsFromDB(
    req.user,
    req.query
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "my appointments retrieved successfully",
    data: result,
  });
});

export const AppointmentControllers = {
  createAppointment,
  getMyAppointment,
};
