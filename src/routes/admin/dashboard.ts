import { Router } from "express";
import { authenticateToken } from "../../middleware/authenticateToken.js";
import { requireRole } from "../../middleware/requireRole.js";

const router = Router();

router.get("/dashboard", authenticateToken, requireRole("admin"), (req, res) => {
    try {
        res.json({ message: "Bienvenue admin !" });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;