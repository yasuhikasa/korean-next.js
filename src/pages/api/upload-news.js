import db from "../../lib/firebase-admin";

export default async function handler(req, res) {
  // POSTメソッド以外を拒否
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // ワークフローから送信されるJSONデータを取得
    const { articles, status } = req.body;

    if (!articles || !Array.isArray(articles)) {
      return res.status(400).json({ error: "Invalid articles format. Expected an array of articles." });
    }

    if (status !== "ok") {
      return res.status(400).json({ error: "Invalid API response status." });
    }

    const batch = db.batch(); // Firestoreのバッチ処理を開始

    articles.forEach((article, index) => {
      const ref = db.collection("news").doc(`article-${Date.now()}-${index}`); // ユニークIDを生成

      // Firestoreに保存するフィールドを構造化
      batch.set(ref, {
        title: article.title || "Untitled",
        description: article.description || "No description provided",
        url: article.url || "",
        urlToImage: article.urlToImage || "",
        publishedAt: article.publishedAt || null,
        source: article.source?.name || "Unknown",
        author: article.author || "Unknown",
        content: article.content || "",
        createdAt: new Date(),
      });
    });

    await batch.commit(); // Firestoreに一括保存

    res.status(200).json({ message: "Articles saved successfully." });
  } catch (error) {
    console.error("Error saving articles:", error);
    res.status(500).json({ error: "Failed to save articles" });
  }
}
