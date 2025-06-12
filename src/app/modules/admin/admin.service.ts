import prisma from "../../shared/prisma";
import QueryBuilder from "../../shared/queryBuilder";

const getAllAdminsFromDB = async (query: Record<string, unknown>) => {
 
  const searchableFields = ["name", "email"];

  const queryBuilder = new QueryBuilder(prisma.admin, query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const admins = await queryBuilder.execute();
  const meta = await queryBuilder.countTotal();

  return { meta, data:admins };
};

export const AdminServices = {
  getAllAdminsFromDB,
};