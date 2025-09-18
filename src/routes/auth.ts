import { Router } from "express";
import { calculateEntropy } from "../services/entropy.js";
import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { bloomFilter } from "./bloomFilters.js";

const router = Router();

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    // Vérification présence username et password
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
    }

    // Vérification caractères spéciaux, majuscules et chiffres
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: "Password must contain at least one uppercase letter, one digit, and one special character." });
    }

    // Vérification entropie
    if (calculateEntropy(password) < 45) {
        return res.status(400).json({ error: "Password too weak" });
    }

    // Vérification du leak via Bloom filter
    if (bloomFilter && bloomFilter.has(password)) {
        return res.status(400).json({ error: "Password leaked in a previous data breach." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: { username, password: hashedPassword },
        }); user

        res.status(201).json({ id: user.id, username: user.username });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
    }

    try {
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET || "dev-secret",
            { expiresIn: "1h" }
        );

        res.status(200).json({ token, id: user.id, username: user.username });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
