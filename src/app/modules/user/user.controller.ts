import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { UserServices } from "./user.service";
import httpStatus from "http-status";

const CreateAdmin = catchAsync(async(req, res) => {
const {password, admin}=req.body
 const result = await UserServices.CreateAdminIntoDB(password, admin);

 sendResponse(res, {
   statusCode: httpStatus.OK,
   success:true,
   message:"Admin Created Successfully",
   data:result
 });
})

const getAllUsers = catchAsync (async(req, res) =>{
  const result = await UserServices.getAllUsersFromDB();

  sendResponse(res, {
    statusCode:httpStatus.OK,
    success:true,
    message:"Users retreived successfully",
    meta:result.meta,
    data:result.data
  })
})


export const UserControllers = {
  CreateAdmin,
  getAllUsers,
};