import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
import registerRouter from "./routes/register.js";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.use("/register", registerRouter);


app.get("/", (req: Request, res: Response) => {
    res.send("Backend Node.js TS OK TSTSTSTSTS !");
});

// Démarrage serveur
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
