import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import adminRouter from "./routes/admin/dashboard.js";
import rateLimit from "express-rate-limit";
import "dotenv/config";
import bloomFiltersRouter from "./routes/bloomFilters.js"

const app = express();
const PORT = 3000;
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limite chaque IP à 100 requêtes par fenêtre
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware
app.use(limiter);
app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/bloom", bloomFiltersRouter);
app.use("/admin", adminRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("Backend Node.js TS OK TSTSTSTSTS !");
});

// Démarrage serveur
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
