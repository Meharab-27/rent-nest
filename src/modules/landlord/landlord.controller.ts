import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { landlordService } from "./landlord.service";

const createProperty = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const landlordId = (req as Request & { user?: { id: string } }).user?.id;

  if (!landlordId) {
    res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      statusCode: httpStatus.UNAUTHORIZED,
      message: "Authentication required",
    });
    return;
  }

  const property = await landlordService.createProperty(payload, landlordId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Property created successfully",
    data: { property },
  });
});

const updateProperty = catchAsync(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const payload = req.body;
  const landlordId = (req as Request & { user?: { id: string } }).user?.id;

  if (!id) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: "Property id is required",
    });
    return;
  }

  if (!landlordId) {
    res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      statusCode: httpStatus.UNAUTHORIZED,
      message: "Authentication required",
    });
    return;
  }

  const property = await landlordService.updateProperty(id, landlordId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property updated successfully",
    data: { property },
  });
});

const deleteProperty = catchAsync(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const landlordId = (req as Request & { user?: { id: string } }).user?.id;

  if (!id) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: "Property id is required",
    });
    return;
  }

  if (!landlordId) {
    res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      statusCode: httpStatus.UNAUTHORIZED,
      message: "Authentication required",
    });
    return;
  }

  const property = await landlordService.deleteProperty(id, landlordId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property deleted successfully",
    data: { property },
  });
});

const getRentalRequests = catchAsync(async (req: Request, res: Response) => {
  const landlordId = (req as Request & { user?: { id: string } }).user?.id;

  if (!landlordId) {
    res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      statusCode: httpStatus.UNAUTHORIZED,
      message: "Authentication required",
    });
    return;
  }

  const requests = await landlordService.getRentalRequests(landlordId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental requests fetched successfully",
    data: { requests },
  });
});

const updateRentalRequestStatus = catchAsync(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const payload = req.body;
  const landlordId = (req as Request & { user?: { id: string } }).user?.id;

  if (!id) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: "Rental request id is required",
    });
    return;
  }

  if (!landlordId) {
    res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      statusCode: httpStatus.UNAUTHORIZED,
      message: "Authentication required",
    });
    return;
  }

  const request = await landlordService.updateRentalRequestStatus(id, landlordId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental request updated successfully",
    data: { request },
  });
});

export const landlordController = {
  createProperty,
  updateProperty,
  deleteProperty,
  getRentalRequests,
  updateRentalRequestStatus,
};
