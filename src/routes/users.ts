import { Router } from "express";
import prisma from "../lib/prisma.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = Router();

router.get("/", authenticateToken, async (_req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, username: true, createdAt: true }
        });
        res.json(users);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Missing user id" });

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true, username: true, createdAt: true }
        });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;