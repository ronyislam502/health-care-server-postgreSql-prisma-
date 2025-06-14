import { UserStatus } from "@prisma/client";
import config from "../../config";
import AppError from "../../errors/AppError";
// import { createToken } from "../../shared/jwtHelpers";
import prisma from "../../shared/prisma";
import { TLoginUser } from "./auth.interface";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { SignOptions } from "jsonwebtoken";
import { createToken } from "../../shared/jwtHelpers";

const loginUserFromDB = async (payload: TLoginUser) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  const isDeleted = user?.status;

  if (isDeleted === UserStatus.DELETED) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
  }

  const isActive = user?.status;

  if (isActive === UserStatus.BLOCKED) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked ! !");
  }

  const isCorrectPassword = await bcrypt.compare(
    payload?.password,
    user?.password as string
  );

  if (!isCorrectPassword) {
    throw new AppError(httpStatus.FORBIDDEN, "Password do not matched");
  }

  const jwtPayload = {
    email: user?.email as string,
    role: user?.role as string,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_Token_secrete as string,
    config.jwt_access_token_expire_in as SignOptions["expiresIn"]
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_token_secrete as string,
    config.jwt_refresh_token_expire_in as SignOptions["expiresIn"]
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user?.needPasswordChange,
  };
};

export const AuthServices = {
  loginUserFromDB,
};
