import db from "../../lib/firebase-admin";

export default async function handler(req, res) {
  try {
    const snapshot = await db.collection("news").get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
