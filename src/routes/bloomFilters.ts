import { Router } from "express";
import type { Request, Response } from "express";
import fs from "fs";
import path from "path";
import readline from "readline";
import os from "os";
import pkg from "bloom-filters";

const { BloomFilter } = pkg;

const router = Router();

let bloomFilter: InstanceType<typeof BloomFilter> | null = null;

// Utiliser le dossier temporaire du système pour le cache
const bloomDir = "/app/cache";  // correspond à C:/Users/hugo1/Desktop/TP/cache sur Windows
const bloomFilePath = path.resolve(bloomDir, "bloom.json");

// Fonction pour charger le Bloom filter depuis le disque au démarrage
async function loadBloomFilter() {
  try {
    const data = await fs.promises.readFile(bloomFilePath, "utf-8");
    const json = JSON.parse(data);
    bloomFilter = BloomFilter.fromJSON(json);
    console.log("Bloom filter loaded from disk:", bloomFilePath);
  } catch (err) {
    console.log("No existing Bloom filter found in temp, will generate on /cache.");
  }
}

// Charger le filtre au démarrage si présent
loadBloomFilter();

// POST /bloom/cache
router.post("/cache", async (req: Request, res: Response) => {
  const inputPath: string = req.body.path;
  if (!inputPath) {
    return res.status(400).json({ error: "Path is required in the request body." });
  }

  const fullPath = path.resolve(process.cwd(), inputPath);
  console.log("Using wordlist at:", fullPath);

  try {
    await fs.promises.access(fullPath, fs.constants.R_OK);

    const words: string[] = [];
    const fileStream = fs.createReadStream(fullPath, { encoding: "utf-8" });
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    for await (const line of rl) {
      const word = line.trim();
      if (word.length > 0) words.push(word);
    }

    const falsePositiveRate = 0.01;
    bloomFilter = BloomFilter.from(words, falsePositiveRate);

    // Sauvegarder le Bloom filter sur le disque dans le dossier temporaire
    await fs.promises.writeFile(bloomFilePath, JSON.stringify(bloomFilter.saveAsJSON()));
    console.log("Bloom filter saved to temp directory:", bloomFilePath);

    res.json({ success: true, message: "Bloom filter generated, cached, and saved to temp.", count: words.length });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate bloom filter: " + (err as Error).message });
  }
});

// GET /bloom/check?word=abc
router.get("/check", (req: Request, res: Response) => {
  const word = req.query.word as string;
  if (!word) {
    return res.status(400).json({ error: "Query parameter 'word' is required." });
  }
  if (!bloomFilter) {
    return res.status(400).json({ error: "Bloom filter not initialized. Call /cache first." });
  }
  const result = bloomFilter.has(word);
  res.json({ word, probable: result });
});

export default router;
export { bloomFilter };
