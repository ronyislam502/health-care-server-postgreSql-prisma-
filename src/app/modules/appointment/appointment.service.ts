import { JwtPayload } from "jsonwebtoken";
import prisma from "../../shared/prisma";
import { v4 as uuidv4 } from "uuid";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { UserRole } from "@prisma/client";
import HealthQueryBuilder from "../../builder/healthQuery";

const createAppointmentIntoDB = async (user: JwtPayload, payload: any) => {
  const isPatient = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const isDoctor = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
    },
  });

  const isSchedule = await prisma.doctorSchedules.findFirst({
    where: {
      doctorId: isDoctor.id,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });

  if (!isSchedule) {
    throw new AppError(httpStatus.NOT_FOUND, "This schedule not found");
  }

  const videoCallingId: string = uuidv4();

  const result = await prisma.$transaction(async (transactionClient) => {
    const appointmentData = await transactionClient.appointment.create({
      data: {
        patientId: isPatient.id,
        doctorId: isDoctor.id,
        scheduleId: payload.scheduleId,
        videoCallingId,
      },
      include: {
        patient: true,
        doctor: true,
        schedule: true,
      },
    });

    await transactionClient.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: isDoctor.id,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
        appointmentId: appointmentData.id,
      },
    });
    return appointmentData;
  });

  return result;
};

const getMyAppointmentsFromDB = async (
  user: JwtPayload,
  query: Record<string, unknown>
) => {
  let profileInfo;

  if (user.role === UserRole.DOCTOR) {
    profileInfo = await prisma.doctor.findUnique({
      where: {
        email: user.email,
      },
    });

    if (profileInfo?.id) {
      query.doctorId = profileInfo.id;
    }
  } else if (user.role === UserRole.PATIENT) {
    profileInfo = await prisma.patient.findUnique({
      where: {
        email: user.email,
      },
    });

    if (profileInfo?.id) {
      query.patientId = profileInfo.id;
    }
  }

  const appointmentQuery = new HealthQueryBuilder(prisma.appointment, query)
    .filter()
    .sort()
    .paginate()
    .fields()
    .setInclude(
      user?.role === UserRole.PATIENT
        ? { doctor: true, schedule: true }
        : {
            patient: {
              include: { medicalReport: true, patientHealthData: true },
            },
            schedule: true,
          }
    );

  const meta = await appointmentQuery.countTotal();
  const data = await appointmentQuery.execute();

  console.log(data?.patient?.email);

  return { meta, data };
};

export const AppointmentServices = {
  createAppointmentIntoDB,
  getMyAppointmentsFromDB,
};
