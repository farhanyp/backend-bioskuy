import { prismaClient } from "../application/database.js";

  
  export const messageRouter = (ws, message) => {
    return prismaClient.users.findMany()
  };
  