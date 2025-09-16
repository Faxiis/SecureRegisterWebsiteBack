import express from "express";
import cors from "cors";
const app = express();
const PORT = 3000;
// Middleware
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Backend Node.js TS OK !");
});
// Démarrage serveur
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map