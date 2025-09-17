import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import bloomFiltersRouter from "./routes/bloomFilters.js"

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/bloom", bloomFiltersRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("Backend Node.js TS OK TSTSTSTSTS !");
});

// Démarrage serveur
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
