import { ObjectId } from "mongodb";
import applyCors from "../../../lib/cors";
import clientPromise from "../../../lib/mongodb";
import process from "process";

function isValidId(id) {
  return ObjectId.isValid(id);
}

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  const { id } = req.query || {};
  if (!id || !isValidId(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    const client = await clientPromise;
    const dbName = process.env.MONGODB_DB || "app";
    const db = client.db(dbName);
    const collection = db.collection("items");
    const _id = new ObjectId(id);

    if (req.method === "GET") {
      const item = await collection.findOne({ _id });
      if (!item) {
        return res.status(404).json({ error: "Not found" });
      }
      return res.status(200).json({ item });
    }

    if (req.method === "PUT") {
      const { name, value } = req.body || {};
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ error: "name is required" });
      }

      const result = await collection.updateOne(
        { _id },
        {
          $set: {
            name: name.trim(),
            value: value ?? null,
            updatedAt: new Date()
          }
        }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Not found" });
      }

      return res.status(200).json({ ok: true });
    }

    if (req.method === "DELETE") {
      const result = await collection.deleteOne({ _id });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Not found" });
      }
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
}
