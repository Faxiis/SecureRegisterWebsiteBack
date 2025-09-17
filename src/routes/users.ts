import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

router.get("/", async (_req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, username: true, createdAt: true }
        });
        res.json(users);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
            select: { id: true, username: true, createdAt: true }
        });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;