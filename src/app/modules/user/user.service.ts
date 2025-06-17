import prisma, { TransactionClient } from "../../shared/prisma";
import QueryBuilder from "../../shared/queryBuilder";
import { Admin, UserRole, UserStatus } from "@prisma/client";
import { userSearchableFields } from "./user.interface";
import { hashPassword } from "../../shared/bcryptHelpers";
import config from "../../config";
import { TImageFile } from "../../interface/image.interface";

const CreateAdminIntoDB = async (
  image: TImageFile,
  password: string,
  payload: Admin
): Promise<Admin> => {
  // console.log("admin", payload)

  console.log("image", image);

  // const file = image;
  // payload.avatar = file?.path;
  if (image && image.path) {
    payload.avatar = image.path;
  }

  const hashedPassword = await hashPassword(
    password,
    Number(config.bcrypt_salt_rounds)
  );
  // console.log("pass", hashedPassword)

  const userData = {
    name: payload.name,
    email: payload.email,
    password: hashedPassword,
    role: UserRole?.ADMIN,
  };

  const result = await prisma.$transaction(
    async (transactionClient: TransactionClient) => {
      await transactionClient.user.create({
        data: userData,
      });
      const createAdmin = await transactionClient.admin.create({
        data: payload,
      });

      return createAdmin;
    }
  );

  return result;
};

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(prisma.user, query)
    .search(userSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const users = await queryBuilder.execute();
  const meta = await queryBuilder.countTotal();

  return { meta, data: users };
};

const getSingleUserFromDB = async (id: string) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  return result;
};

const changeProfileStatusFromDB = async (id: string, status: UserRole) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updateStatus = await prisma.user.update({
    where: {
      id,
    },
    data: status,
  });

  return updateStatus;
};

const getMyProfileFromDB = async (email: string) => {
  const userinfo = await prisma.user.findUniqueOrThrow({
    where: {
      email,
      status: UserStatus.ACTIVE,
    },
  });

  let profileInfo;
  if (userinfo.role === UserRole.ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userinfo.email,
      },
    });
  }

  return { ...userinfo, ...profileInfo };
};

export const UserServices = {
  CreateAdminIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  changeProfileStatusFromDB,
  getMyProfileFromDB,
};
