import { Patient, UserStatus } from "@prisma/client";
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

const getSinglePatientFromDB = async (id: string) => {
  const result = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  return result;
};

const deletePatientFromDB = async (id: string): Promise<Patient | null> => {
  await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const patientDelete = await transactionClient.patient.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.patient.update({
      where: {
        email: patientDelete?.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return patientDelete;
  });

  return result;
};

export const PatientServices = {
  getAllPatientsFromDB,
  getSinglePatientFromDB,
  deletePatientFromDB,
};
