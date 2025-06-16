import prisma, { TransactionClient } from "../../shared/prisma";
import QueryBuilder from "../../shared/queryBuilder";
import { Admin, UserRole } from "@prisma/client";
import { userSearchableFields } from "./user.interface";
import { hashPassword } from "../../shared/bcryptHelpers";
import config from "../../config";

const CreateAdminIntoDB = async (
  password: string,
  payload: Admin
): Promise<Admin> => {
  // console.log("admin", payload)
  const hashedPassword = await hashPassword(
    password,
    Number(config.bcrypt_salt_rounds)
  );
  // console.log("pass", hashedPassword)

  const userData = {
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

export const UserServices = {
  CreateAdminIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
};
