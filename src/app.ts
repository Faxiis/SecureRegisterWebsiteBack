import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import type { Request, Response } from "express";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import adminRouter from "./routes/admin/dashboard.js";
import bloomFiltersRouter from "./routes/bloomFilters.js";
import { authenticateToken } from "./middleware/authenticateToken.js";

const app = express();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);
app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/bloom", bloomFiltersRouter);
app.use("/admin", adminRouter);

app.get("/", authenticateToken, (req: Request, res: Response) => {
    res.send("Backend Node.js TS OK TSTSTSTSTS !");
});

export default app;
