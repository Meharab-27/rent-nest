import "dotenv/config";
import serverless from "serverless-http";
import app from "../src/app";
import { prisma } from "../src/lib/prisma";

const handler = serverless(app);
let isPrismaConnected = false;

const connectPrisma = async () => {
  if (isPrismaConnected) return;
  await prisma.$connect();
  isPrismaConnected = true;
};

export default async (event: any, context: any) => {
  await connectPrisma();
  return handler(event, context);
};
