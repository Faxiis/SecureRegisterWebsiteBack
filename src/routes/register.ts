import { Router } from "express";
import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

const router = Router();

router.post("/", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: { username, password: hashedPassword },
        });

        res.status(201).json({ id: user.id, username: user.username });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
