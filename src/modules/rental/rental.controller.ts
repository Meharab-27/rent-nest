import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { rentalService } from "./rental.service";

const createRentalRequest = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const tenantId = (req as Request & { user?: { id: string } }).user?.id;

  if (!tenantId) {
    res.status(httpStatus.UNAUTHORIZED).json({ success: false, statusCode: httpStatus.UNAUTHORIZED, message: "Authentication required" });
    return;
  }

  const rentalRequest = await rentalService.createRentalRequest(payload, tenantId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Rental request submitted successfully",
    data: { rentalRequest },
  });
});

const getMyRentalRequests = catchAsync(async (req: Request, res: Response) => {
  const tenantId = (req as Request & { user?: { id: string } }).user?.id;

  if (!tenantId) {
    res.status(httpStatus.UNAUTHORIZED).json({ success: false, statusCode: httpStatus.UNAUTHORIZED, message: "Authentication required" });
    return;
  }

  const rentalRequests = await rentalService.getMyRentalRequests(tenantId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental requests fetched successfully",
    data: { rentalRequests },
  });
});

const getRentalRequestById = catchAsync(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const tenantId = (req as Request & { user?: { id: string } }).user?.id;

  if (!id) {
    res.status(httpStatus.BAD_REQUEST).json({ success: false, statusCode: httpStatus.BAD_REQUEST, message: "Rental request id is required" });
    return;
  }

  if (!tenantId) {
    res.status(httpStatus.UNAUTHORIZED).json({ success: false, statusCode: httpStatus.UNAUTHORIZED, message: "Authentication required" });
    return;
  }

  const rentalRequest = await rentalService.getRentalRequestById(id, tenantId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental request fetched successfully",
    data: { rentalRequest },
  });
});

export const rentalController = {
  createRentalRequest,
  getMyRentalRequests,
  getRentalRequestById,
};
