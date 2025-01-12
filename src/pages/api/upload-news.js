import db from "../../lib/firebase-admin";
import { v4 as uuidv4 } from "uuid"; // UUIDを使用してユニークIDを生成

export default async function handler(req, res) {
  // POSTメソッド以外を拒否
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // ワークフローから送信されるJSONデータを取得
    const { articles, status } = req.body;

    // デバッグ用ログ
    console.log("Request Body:", req.body);

    // バリデーション: articlesが配列であることを確認
    if (!articles || !Array.isArray(articles)) {
      return res
        .status(400)
        .json({ error: "Invalid articles format. Expected an array of articles." });
    }

    // バリデーション: statusが"ok"であることを確認
    if (status !== "ok") {
      return res.status(400).json({ error: "Invalid API response status." });
    }

    // Firestoreのバッチ処理を開始
    const batch = db.batch();

    articles.forEach((article, index) => {
      const ref = db.collection("news").doc(uuidv4()); // UUIDでユニークIDを生成

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

    // バッチをコミットしてFirestoreに一括保存
    await batch.commit();

    // 成功レスポンス
    res.status(200).json({ message: "Articles saved successfully." });
  } catch (error) {
    // エラー発生時の詳細ログ
    console.error("Error saving articles:", error);

    // エラーレスポンス
    res
      .status(500)
      .json({ error: "Failed to save articles", details: error.message });
  }
}
