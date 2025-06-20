import { Patient } from "@prisma/client";
import prisma from "../../shared/prisma";
import QueryBuilder from "../../shared/queryBuilder";
import { TMeta } from "../../shared/sendResponse";
import { patientSearchableFields } from "./patient.interface";

const getAllPatientsFromDB = async (
  query: Record<string, unknown>
): Promise<{ meta: TMeta; data: Patient[] }> => {
  const patientQuery = new QueryBuilder(prisma.patient, query)
    .search(patientSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const meta = await patientQuery.countTotal();
  const data = await patientQuery.execute();

  return { meta, data };
};

export const PatientServices = {
  getAllPatientsFromDB,
};
