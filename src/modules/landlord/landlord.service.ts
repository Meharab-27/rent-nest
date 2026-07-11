import { prisma } from "../../lib/prisma";
import {
  ICreatePropertyPayload,
  IUpdatePropertyPayload,
  IUpdateRentalRequestPayload,
} from "./landlord.interface";

const createProperty = async (payload: ICreatePropertyPayload, landlordId: string) => {
  return prisma.property.create({
    data: {
      ...payload,
      landlordId,
      status: payload.status ?? "AVAILABLE",
    },
  });
};

const updateProperty = async (
  propertyId: string,
  landlordId: string,
  payload: IUpdatePropertyPayload
) => {
  const existingProperty = await prisma.property.findFirst({
    where: { id: propertyId, landlordId },
  });

  if (!existingProperty) {
    throw new Error("Property not found");
  }

  return prisma.property.update({
    where: { id: propertyId },
    data: payload,
  });
};

const deleteProperty = async (propertyId: string, landlordId: string) => {
  const existingProperty = await prisma.property.findFirst({
    where: { id: propertyId, landlordId },
  });

  if (!existingProperty) {
    throw new Error("Property not found");
  }

  await prisma.property.delete({ where: { id: propertyId } });

  return existingProperty;
};

const getRentalRequests = async (landlordId: string) => {
  return prisma.rentalRequest.findMany({
    where: {
      property: {
        landlordId,
      },
    },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          location: true,
          city: true,
          price: true,
        },
      },
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateRentalRequestStatus = async (
  requestId: string,
  landlordId: string,
  payload: IUpdateRentalRequestPayload
) => {
  const request = await prisma.rentalRequest.findFirst({
    where: {
      id: requestId,
      property: {
        landlordId,
      },
    },
  });

  if (!request) {
    throw new Error("Rental request not found");
  }

  return prisma.$transaction(async (tx) => {
    const updatedRequest = await tx.rentalRequest.update({
      where: { id: requestId },
      data: { status: payload.status },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
        tenant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (payload.status === "APPROVED") {
      await tx.property.update({
        where: { id: request.propertyId },
        data: { status: "BOOKED" },
      });
    }

    return updatedRequest;
  });
};

export const landlordService = {
  createProperty,
  updateProperty,
  deleteProperty,
  getRentalRequests,
  updateRentalRequestStatus,
};
