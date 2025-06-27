import { Review } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../shared/prisma";
import AppError from "../../errors/AppError";

const createReviewIntoDB = async (user: JwtPayload, payload: Review) => {
  const isAppointment = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
    },
    include: {
      patient: true,
    },
  });

  if (user.email !== isAppointment.patient.email) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "this appointment is not your appointment"
    );
  }
};

export const ReviewServices = {
  createReviewIntoDB,
};
