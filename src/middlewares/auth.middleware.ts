import { NextFunction, Request, Response } from "express";
import config from "../config/index";
import { prisma } from "../lib/prisma";
import { jwtUtils } from "../utils/jwt";

interface IUserPayload {
  id: string;
  name: string;
  email: string;
  role: string;
}

type AuthenticatedRequest = Request & {
  user?: IUserPayload;
};

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const request = req as AuthenticatedRequest;
  const tokenFromCookie = req.cookies?.accessToken;
  const tokenFromHeader = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : undefined;
  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    res.status(401).json({
      success: false,
      statusCode: 401,
      message: "Authentication token is required",
    });
    return;
  }

  const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

  if (!verifiedToken.success || typeof verifiedToken.data !== "object" || verifiedToken.data === null) {
    res.status(401).json({
      success: false,
      statusCode: 401,
      message: "Invalid or expired token",
    });
    return;
  }

  const tokenPayload = verifiedToken.data as { id?: string };

  if (!tokenPayload.id) {
    res.status(401).json({
      success: false,
      statusCode: 401,
      message: "Invalid token payload",
    });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: tokenPayload.id },
  });

  if (!user) {
    res.status(401).json({
      success: false,
      statusCode: 401,
      message: "User not found",
    });
    return;
  }

  request.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  next();
};

const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const request = req as AuthenticatedRequest;

    if (!request.user || !roles.includes(request.user.role)) {
      res.status(403).json({
        success: false,
        statusCode: 403,
        message: "You are not authorized to access this resource",
      });
      return;
    }

    next();
  };
};

export { authenticate, authorizeRoles };
