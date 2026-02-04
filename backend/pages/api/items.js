import applyCors from "../../lib/cors.js";
import clientPromise from "../../lib/mongodb.js";
import process from "process";

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  try {
    const client = await clientPromise;
    const dbName = process.env.MONGODB_DB || "app";
    const db = client.db(dbName);
    const collection = db.collection("items");

    if (req.method === "GET") {
      const page = Math.max(parseInt(req.query?.page || "1", 10), 1);
      const limit = Math.min(
        Math.max(parseInt(req.query?.limit || "100", 10), 1),
        100
      );
      const skip = (page - 1) * limit;

      const [items, total] = await Promise.all([
        collection.find({}).skip(skip).limit(limit).toArray(),
        collection.countDocuments()
      ]);

      return res.status(200).json({
        items,
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1)
      });
    }

    if (req.method === "POST") {
      const { name, value } = req.body || {};
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ error: "name is required" });
      }
      const result = await collection.insertOne({
        name: name.trim(),
        value: value ?? null,
        createdAt: new Date()
      });
      return res.status(201).json({ id: result.insertedId });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
};
