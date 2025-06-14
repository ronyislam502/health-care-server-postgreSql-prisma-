import { Admin, UserStatus } from "@prisma/client";
import prisma from "../../shared/prisma";
import QueryBuilder from "../../shared/queryBuilder";
import { adminSearchableFields } from "./admin.interface";
import { TMeta } from "../../shared/sendResponse";

const getAllAdminsFromDB = async (
  query: Record<string, unknown>
): Promise<{ meta: TMeta; data: Admin[] }> => {
  const queryBuilder = new QueryBuilder(prisma.admin, query)
    .search(adminSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const admins = await queryBuilder.execute();
  const meta = await queryBuilder.countTotal();

  return { meta, data: admins };
};

const getSingleAdminFromDB = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};

const updateAdminIntoDB = async (
  id: string,
  payload: Partial<Admin>
): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const updatedAdmin = await prisma.admin.update({
    where: {
      id,
    },
    data: payload,
  });

  return updatedAdmin;
};

// const deleteAdminFromDB = async (id: string): Promise<Admin | null> => {
//   await prisma.admin.findUniqueOrThrow({
//     where: {
//       id,
//     },
//   });

//   const result = await prisma.$transaction(async (transactionClient) => {
//     const adminDelete = await transactionClient.admin.delete({
//       where: {
//         id,
//       },
//     });

//     await transactionClient.user.delete({
//       where: {
//         email: adminDelete?.email,
//       },
//     });

//     return adminDelete;
//   });

//   return result;
// };

const deleteAdminFromDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDelete = await transactionClient.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: adminDelete?.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return adminDelete;
  });

  return result;
};

export const AdminServices = {
  getAllAdminsFromDB,
  getSingleAdminFromDB,
  updateAdminIntoDB,
  deleteAdminFromDB,
};
