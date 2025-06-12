import bcrypt from "bcrypt";
import prisma, { TransactionClient } from "../../shared/prisma";
import QueryBuilder from "../../shared/queryBuilder";
import { Admin, UserRole } from "@prisma/client";



const CreateAdminIntoDB = async (password:string, payload:Admin) => {
  // console.log("admin", payload)
  const hashedPassword = await bcrypt.hash(password, 12);
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
  const searchableFields = ["role", "email"];

  const queryBuilder = new QueryBuilder(prisma.user, query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const users = await queryBuilder.execute();
  const meta = await queryBuilder.countTotal();

  return { meta, data: users };
};

export const UserServices = {
  CreateAdminIntoDB,
  getAllUsersFromDB,
};