import { Doctor, Specialty, UserStatus } from "@prisma/client";
import prisma from "../../shared/prisma";
import QueryBuilder from "../../shared/queryBuilder";
import { TMeta } from "../../shared/sendResponse";
import { doctorSearchableFields } from "./doctor.interface";
import { TImageFile } from "../../interface/image.interface";

const getAllDoctorsFromDB = async (
  query: Record<string, unknown>
): Promise<{ meta: TMeta; data: Doctor[] }> => {
  const doctorQuery = new QueryBuilder(prisma.doctor, query)
    .search(doctorSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields()
    .setInclude({
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    });

  const meta = await doctorQuery.countTotal();
  const data = await doctorQuery.execute();

  return { meta, data };
};

const getSingleDoctorFromDB = async (id: string): Promise<Doctor> => {
  const result = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
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

const updateDoctorFromDB = async (
  id: string,
  image: TImageFile,
  payload: any
) => {
  // console.log("uu", payload);
  const { specialties, ...doctorData } = payload;
  const isDoctor = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const file = image;
  if (file) {
    payload.avatar = file.path;
  }

  await prisma.$transaction(async (transactionClient) => {
    await prisma.doctor.update({
      where: {
        id,
      },
      data: doctorData,
      include: {
        doctorSpecialties: true,
      },
    });

    if (specialties && specialties.length > 0) {
      // delete specialties
      const deleteDoctorSpecialties = await specialties.filter(
        (specialty: any) => specialty.isDeleted
      );
      // console.log("dele", deleteSpecialtiesIds);
      for (const specialty of deleteDoctorSpecialties) {
        await transactionClient.doctorSpecialties.deleteMany({
          where: {
            doctorId: isDoctor?.id,
            specialtiesId: specialty.specialtiesId,
          },
        });
      }

      // create specialties
      const createDoctorSpecialties = await specialties.filter(
        (specialty: any) => !specialty.isDeleted
      );

      // console.log("cre", createDoctorSpecialties);

      for (const specialty of createDoctorSpecialties) {
        await transactionClient.doctorSpecialties.create({
          data: {
            doctorId: isDoctor?.id,
            specialtiesId: specialty.specialtiesId,
          },
        });
      }
    }
  });

  const result = await prisma.doctor.findUnique({
    where: {
      id: isDoctor.id,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  return result;
};

export const DoctorServices = {
  getAllDoctorsFromDB,
  getSingleDoctorFromDB,
  deleteDoctorFromDB,
  updateDoctorFromDB,
};
