import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { PatientServices } from "./patient.service";

const getAllPatients = catchAsync(async (req, res) => {
  const result = await PatientServices.getAllPatientsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patients reprieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const PatientControllers = {
  getAllPatients,
};
