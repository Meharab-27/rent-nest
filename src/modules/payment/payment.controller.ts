import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const userId = (req as Request & { user?: { id: string } }).user?.id;

  if (!userId) {
    res.status(httpStatus.UNAUTHORIZED).json({ success: false, statusCode: httpStatus.UNAUTHORIZED, message: "Authentication required" });
    return;
  }

  if (!payload?.rentalRequestId || !payload?.amount || !payload?.method || !payload?.provider) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: "rentalRequestId, amount, method, and provider are required",
    });
    return;
  }

  const payment = await paymentService.createPayment(payload, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Payment created successfully",
    data: { payment },
  });
});

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const payment = await paymentService.confirmPayment(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment confirmed successfully",
    data: { payment },
  });
});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as Request & { user?: { id: string } }).user?.id;

  if (!userId) {
    res.status(httpStatus.UNAUTHORIZED).json({ success: false, statusCode: httpStatus.UNAUTHORIZED, message: "Authentication required" });
    return;
  }

  const payments = await paymentService.getMyPayments(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payments fetched successfully",
    data: { payments },
  });
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const userId = (req as Request & { user?: { id: string } }).user?.id;

  if (!id) {
    res.status(httpStatus.BAD_REQUEST).json({ success: false, statusCode: httpStatus.BAD_REQUEST, message: "Payment id is required" });
    return;
  }

  if (!userId) {
    res.status(httpStatus.UNAUTHORIZED).json({ success: false, statusCode: httpStatus.UNAUTHORIZED, message: "Authentication required" });
    return;
  }

  const payment = await paymentService.getPaymentById(id, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment fetched successfully",
    data: { payment },
  });
});

export const paymentController = {
  createPayment,
  confirmPayment,
  getMyPayments,
  getPaymentById,
};
