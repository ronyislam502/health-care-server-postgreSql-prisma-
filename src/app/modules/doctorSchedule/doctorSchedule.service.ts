import { JwtPayload } from "jsonwebtoken";
import prisma from "../../shared/prisma";
import HealthQueryBuilder from "../../builder/healthQuery";

const createDoctorSchedule = async (user: any, payload: any) => {
  const isDoctor = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const schedule = payload.scheduleIds.map((scheduleId: string) => ({
    doctorId: isDoctor.id,
    scheduleId,
  }));

  const result = await prisma.doctorSchedules.createMany({
    data: schedule,
  });

  return result;
};

const getMyScheduleFromDB = async (
  user: JwtPayload,
  query: Record<string, unknown>
) => {
  const isDoctor = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  query.doctorId = isDoctor.id;

  const doctorScheduleQuery = new HealthQueryBuilder(
    prisma.doctorSchedules,
    query
  )
    .filter()
    .sort()
    .paginate()
    .fields()
    .setInclude({
      doctor: true,
    });

  const meta = await doctorScheduleQuery.countTotal();
  const data = await doctorScheduleQuery.execute();

  return { meta, data };

  //   const schedules = await prisma.doctorSchedules.findMany({
  //     where: {
  //       doctorId: isDoctor.id,
  //     },
  //     include: {
  //       doctor: true,
  //     },
  //   });

  //   return schedules;
};

export const DoctorScheduleServices = {
  createDoctorSchedule,
  getMyScheduleFromDB,
};
