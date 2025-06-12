import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AdminServices } from "./admin.service";
import httpStatus from "http-status";

const getAllAdmins = catchAsync(async (req, res) => {
  const query = { ...req.query };
  const result = await AdminServices.getAllAdminsFromDB(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admins retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const AdminControllers = {
  getAllAdmins,
};
