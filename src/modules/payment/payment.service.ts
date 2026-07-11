import { prisma } from "../../lib/prisma";
import { IConfirmPaymentPayload, ICreatePaymentPayload } from "./payment.interface";

const createPayment = async (payload: ICreatePaymentPayload, userId: string) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: payload.rentalRequestId },
  });

  if (!rentalRequest || rentalRequest.tenantId !== userId) {
    throw new Error("Rental request not found for the current tenant");
  }

  if (rentalRequest.status !== "APPROVED") {
    throw new Error("Rental request must be approved before payment");
  }

  return prisma.payment.create({
    data: {
      rentalRequestId: payload.rentalRequestId,
      amount: payload.amount,
      method: payload.method,
      provider: payload.provider,
      status: "PENDING",
      userId,
    },
    include: {
      rentalRequest: true,
    },
  });
};

const confirmPayment = async (payload: IConfirmPaymentPayload) => {
  return prisma.payment.update({
    where: { id: payload.paymentId },
    data: {
      transactionId: payload.transactionId,
      status: payload.status,
      paidAt: payload.status === "COMPLETED" ? new Date() : null,
    },
  });
};

const getMyPayments = async (userId: string) => {
  return prisma.payment.findMany({
    where: { userId },
    include: {
      rentalRequest: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const getPaymentById = async (paymentId: string, userId: string) => {
  const payment = await prisma.payment.findFirst({
    where: { id: paymentId, userId },
    include: {
      rentalRequest: true,
    },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  return payment;
};

export const paymentService = {
  createPayment,
  confirmPayment,
  getMyPayments,
  getPaymentById,
};
