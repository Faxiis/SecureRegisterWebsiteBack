// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// On crée une instance unique de PrismaClient
// pour éviter plusieurs connexions à la DB
const prisma = new PrismaClient();

export default prisma;  