import { Specialty } from "@prisma/client";
import prisma from "../../shared/prisma";

const createSpecialtiesIntoDB = async (payload: Specialty) => {
  const result = await prisma.specialty.create({
    data: payload,
  });

  return result;
};

export const SpecialtiesServices = {
  createSpecialtiesIntoDB,
};
