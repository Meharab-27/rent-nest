import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { reviewService } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const userId = (req as Request & { user?: { id: string } }).user?.id;

  if (!userId) {
    res.status(httpStatus.UNAUTHORIZED).json({ success: false, statusCode: httpStatus.UNAUTHORIZED, message: "Authentication required" });
    return;
  }

  const review = await reviewService.createReview(payload, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Review created successfully",
    data: { review },
  });
});

export const reviewController = {
  createReview,
};
