import { prisma } from "../../lib/prisma";

type PropertyQuery = Record<string, unknown>;

const parseStringArray = (value: unknown) => {
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (Array.isArray(value)) {
    return value
      .flatMap((item) => item.split(","))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const getAllProperties = async (query: PropertyQuery) => {
  const where: Record<string, unknown> = {};

  const status = typeof query.status === "string" ? query.status : "AVAILABLE";
  const location = typeof query.location === "string" ? query.location : undefined;
  const city = typeof query.city === "string" ? query.city : undefined;
  const minPrice = typeof query.minPrice === "string" ? Number(query.minPrice) : undefined;
  const maxPrice = typeof query.maxPrice === "string" ? Number(query.maxPrice) : undefined;
  const category = typeof query.category === "string" ? query.category : undefined;
  const type = typeof query.type === "string" ? query.type : undefined;
  const amenities = parseStringArray(query.amenities);

  where.status = status;

  if (location) {
    where.location = { contains: location, mode: "insensitive" };
  }

  if (city) {
    where.city = { contains: city, mode: "insensitive" };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};

    if (minPrice !== undefined) {
      (where.price as Record<string, number>).gte = minPrice;
    }

    if (maxPrice !== undefined) {
      (where.price as Record<string, number>).lte = maxPrice;
    }
  }

  if (category) {
    where.category = { name: { contains: category, mode: "insensitive" } };
  }

  if (type) {
    where.category = { name: { contains: type, mode: "insensitive" } };
  }

  if (amenities.length) {
    where.amenities = { hasSome: amenities };
  }

  return prisma.property.findMany({
    where,
    include: {
      category: true,
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      reviews: {
        select: {
          rating: true,
          comment: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getPropertyById = async (propertyId: string) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    include: {
      category: true,
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      reviews: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!property) {
    throw new Error("Property not found");
  }

  return property;
};

export const propertyService = {
  getAllProperties,
  getPropertyById,
};
