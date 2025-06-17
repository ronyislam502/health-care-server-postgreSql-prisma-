import { TImageFile } from "../../interface/image.interface";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { UserServices } from "./user.service";
import httpStatus from "http-status";

const CreateAdmin = catchAsync(async (req, res) => {
  const { password, admin } = req.body;
  const result = await UserServices.CreateAdminIntoDB(
    req.file as TImageFile,
    password,
    admin
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin Created Successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const query = { ...req.query };
  const result = await UserServices.getAllUsersFromDB(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.getSingleUserFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

const changeProfileStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.changeProfileStatusFromDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile status changed successfully",
    data: result,
  });
});

const getMyProfile = catchAsync(async (req, res) => {
  const { email } = req.params;
  const result = await UserServices.getMyProfileFromDB(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My Profile retrieved successfully",
    data: result,
  });
});

export const UserControllers = {
  CreateAdmin,
  getAllUsers,
  getSingleUser,
  changeProfileStatus
  getMyProfile,
};
