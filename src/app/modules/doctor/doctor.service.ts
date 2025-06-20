import prisma from "../../shared/prisma";
import QueryBuilder from "../../shared/queryBuilder";
import { doctorSearchableFields } from "./doctor.interface";

const getAllDoctorsFromDB = async (query: Record<string, unknown>) => {
  const doctorQuery = new QueryBuilder(prisma.doctor, query)
    .search(doctorSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await doctorQuery.countTotal();
  const data = await doctorQuery.execute();

  return { meta, data };
};

export const DoctorServices = {
  getAllDoctorsFromDB,
};
