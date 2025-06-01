import { PrismaClient } from "@prisma/client";

let primsaInstance: PrismaClient | null = null;
export function getPrismaInstance() {
  if (primsaInstance) {
    return primsaInstance;
  }
  primsaInstance = new PrismaClient();
  return primsaInstance;
}
