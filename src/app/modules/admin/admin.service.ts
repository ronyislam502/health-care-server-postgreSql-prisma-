import prisma from "../../shared/prisma";
import QueryBuilder from "../../shared/queryBuilder";

const getAllAdminsFromDB = async (query: Record<string, unknown> = {}) => {
  const searchableFields = ["name", "email"];

  const queryBuilder = new QueryBuilder(prisma.admin, query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const users = await queryBuilder.execute();
  const meta = await queryBuilder.countTotal();

  return { meta, data: users };
};

export const AdminServices = {
  getAllAdminsFromDB,
};