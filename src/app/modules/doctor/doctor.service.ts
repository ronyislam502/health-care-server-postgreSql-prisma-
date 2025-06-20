import { Doctor, UserStatus } from "@prisma/client";
import prisma from "../../shared/prisma";
import QueryBuilder from "../../shared/queryBuilder";
import { TMeta } from "../../shared/sendResponse";
import { doctorSearchableFields } from "./doctor.interface";

const getAllDoctorsFromDB = async (
  query: Record<string, unknown>
): Promise<{ meta: TMeta; data: Doctor[] }> => {
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

const getSingleDoctorFromDB = async (id: string) => {
  const result = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  return result;
};

const deleteDoctorFromDB = async (id: string): Promise<Doctor | null> => {
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const doctorDelete = await transactionClient.doctor.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: doctorDelete?.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return doctorDelete;
  });

  return result;
};

export const DoctorServices = {
  getAllDoctorsFromDB,
  getSingleDoctorFromDB,
  deleteDoctorFromDB,
};
