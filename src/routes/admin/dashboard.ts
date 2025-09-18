import { Router } from "express";
import { authenticateToken } from "../../middleware/authenticateToken.js";
import { requireRole } from "../../middleware/requireRole.js";

const router = Router();

router.get("/admin/dashboard", authenticateToken, requireRole("admin"), (req, res) => {
    res.json({ message: "Bienvenue admin !" });
});
