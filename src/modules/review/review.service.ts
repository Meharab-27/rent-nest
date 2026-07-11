import { prisma } from "../../lib/prisma";
import { ICreateReviewPayload } from "./review.interface";

const createReview = async (payload: ICreateReviewPayload, userId: string) => {
  const property = await prisma.property.findUnique({ where: { id: payload.propertyId } });

  if (!property) {
    throw new Error("Property not found");
  }

  return prisma.review.create({
    data: {
      propertyId: payload.propertyId,
      userId,
      rating: payload.rating,
      comment: payload.comment,
    },
  });
};

export const reviewService = {
  createReview,
};
