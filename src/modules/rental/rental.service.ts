import { prisma } from "../../lib/prisma";
import { ICreateRentalRequestPayload, IUpdateRentalRequestPayload } from "./rental.interface";

const createRentalRequest = async (payload: ICreateRentalRequestPayload, tenantId: string) => {
  const property = await prisma.property.findUnique({ where: { id: payload.propertyId } });

  if (!property) {
    throw new Error("Property not found");
  }

  if (property.status !== "AVAILABLE") {
    throw new Error("Property is not available for rental requests");
  }

  return prisma.rentalRequest.create({
    data: {
      propertyId: payload.propertyId,
      tenantId,
      status: "PENDING",
      message: payload.message,
    },
    include: {
      property: true,
    },
  });
};

const getMyRentalRequests = async (tenantId: string) => {
  return prisma.rentalRequest.findMany({
    where: { tenantId },
    include: {
      property: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const getRentalRequestById = async (rentalRequestId: string, tenantId: string) => {
  const rentalRequest = await prisma.rentalRequest.findFirst({
    where: { id: rentalRequestId, tenantId },
    include: {
      property: true,
    },
  });

  if (!rentalRequest) {
    throw new Error("Rental request not found");
  }

  return rentalRequest;
};

const updateRentalRequestStatus = async (
  rentalRequestId: string,
  payload: IUpdateRentalRequestPayload
) => {
  return prisma.rentalRequest.update({
    where: { id: rentalRequestId },
    data: payload,
  });
};

export const rentalService = {
  createRentalRequest,
  getMyRentalRequests,
  getRentalRequestById,
  updateRentalRequestStatus,
};
