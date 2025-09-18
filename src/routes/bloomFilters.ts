import { Router } from "express";
import type { Request, Response } from "express";
import fs from "fs";
import path from "path";
import readline from "readline";
import pkg from "bloom-filters";

const { BloomFilter } = pkg;

const router = Router();

let bloomFilter: InstanceType<typeof BloomFilter> | null = null;

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

    res.json({ success: true, message: "Bloom filter generated and cached.", count: words.length });
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
