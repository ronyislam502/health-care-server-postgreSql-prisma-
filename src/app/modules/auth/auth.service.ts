import { UserStatus } from "@prisma/client";
import config from "../../config";
import AppError from "../../errors/AppError";
import prisma from "../../shared/prisma";
import { TLoginUser } from "./auth.interface";
import httpStatus from "http-status";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import { createToken, verifyToken } from "../../shared/jwtHelpers";
import { comparePasswords, hashPassword } from "../../shared/bcryptHelpers";

const loginUserFromDB = async (payload: TLoginUser) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user not found !");
  }

  const isDeleted = user?.status;

  if (isDeleted === UserStatus.DELETED) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
  }

  const isActive = user?.status;

  if (isActive === UserStatus.BLOCKED) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked ! !");
  }

  const isCorrectPassword = await comparePasswords(
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

const refreshTokenFromDB = async (token: string) => {
  const decoded = verifyToken(
    token,
    config.jwt_refresh_token_secrete as string
  );

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: decoded.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (
    user.passwordChangedAt &&
    decoded.iat &&
    user.passwordChangedAt.getTime() / 1000 > decoded.iat
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized !");
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

  return {
    accessToken,
    needPasswordChange: user?.needPasswordChange,
  };
};

const changePasswordIntoDB = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: userData?.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword = await comparePasswords(
    userData.password,
    user.password as string
  );

  if (!isCorrectPassword) {
    throw new AppError(httpStatus.FORBIDDEN, "Password do not matched");
  }

  const passwordHashed = await hashPassword(
    payload.newPassword,
    config.bcrypt_salt_rounds as string
  );

  await prisma.user.update({
    where: {
      email: userData.email,
      role: userData.role,
    },
    data: {
      password: passwordHashed,
      needPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  });

  return null;
};

export const AuthServices = {
  loginUserFromDB,
  refreshTokenFromDB,
  changePasswordIntoDB,
};
