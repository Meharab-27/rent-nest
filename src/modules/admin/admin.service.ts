import { prisma } from "../../lib/prisma";

const getAllUsers = async () => prisma.user.findMany({ orderBy: { createdAt: "desc" } });

const updateUserStatus = async (userId: string, status: "ACTIVE" | "BANNED") => {
  return prisma.user.update({
    where: { id: userId },
    data: { status },
  });
};

const getAllProperties = async () => prisma.property.findMany({ include: { landlord: true }, orderBy: { createdAt: "desc" } });

const getAllRentalRequests = async () => prisma.rentalRequest.findMany({ include: { property: true, tenant: true }, orderBy: { createdAt: "desc" } });

const createCategory = async (payload: { name: string; description?: string }) => prisma.category.create({ data: payload });

const updateCategory = async (categoryId: string, payload: { name?: string; description?: string }) => prisma.category.update({ where: { id: categoryId }, data: payload });

const deleteCategory = async (categoryId: string) => prisma.category.delete({ where: { id: categoryId } });

export const adminService = {
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  getAllRentalRequests,
  createCategory,
  updateCategory,
  deleteCategory,
};
