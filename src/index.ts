import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import rateLimit from "express-rate-limit";
import "dotenv/config";

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

app.get("/", (req: Request, res: Response) => {
    res.send("Backend Node.js TS OK TSTSTSTSTS !");
});

// Démarrage serveur
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
