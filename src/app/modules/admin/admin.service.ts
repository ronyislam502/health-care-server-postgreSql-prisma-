import { Admin } from "@prisma/client";
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

const updateAdminIntoDB = async (id: string) => {};

export const AdminServices = {
  getAllAdminsFromDB,
  getSingleAdminFromDB,
};
