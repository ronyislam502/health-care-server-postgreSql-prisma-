import { UserRole, UserStatus } from "@prisma/client";
import catchAsync from "../shared/catchAsync";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import { verifyToken } from "../shared/jwtHelpers";
import config from "../config";
import prisma from "../shared/prisma";
import { JwtPayload } from "jsonwebtoken";

const auth = (...requiredRoles: UserRole[]) => {
  //   console.log("role", ...requiredRoles);

  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;
    // console.log(token);

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are unauthorized");
    }

    const decoded = verifyToken(
      token,
      config.jwt_access_Token_secrete as string
    ) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: {
        email: decoded.email,
      },
    });

    // console.log("user", user);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
    }
    const isDeleted = user?.status;

    if (isDeleted === UserStatus.DELETED) {
      throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
    }

    const isActive = user?.status;

    if (isActive === UserStatus.BLOCKED) {
      throw new AppError(httpStatus.FORBIDDEN, "This user is blocked !!");
    }

    if (
      user.passwordChangedAt &&
      decoded.iat &&
      user.passwordChangedAt.getTime() / 1000 > decoded.iat
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized !");
    }

    if (requiredRoles && !requiredRoles.includes(decoded?.role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized  hi!"
      );
    }

    req.user = decoded as JwtPayload & { role: string };
    next();
  });
};

export default auth;
