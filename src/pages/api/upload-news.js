import db from "../../lib/firebase-admin";
import { v4 as uuidv4 } from "uuid"; // UUIDを使用してユニークIDを生成
import fetch from "node-fetch"; // Fetch APIを使用するためのパッケージ

export default async function handler(req, res) {
  // POSTメソッド以外を拒否
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 環境変数からAPIキーを取得
    const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API key not found in environment variables." });
    }

    // NewsAPIからデータを取得
    const apiUrl = `https://newsapi.org/v2/everything?q=korea&apiKey=${apiKey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    // デバッグ用ログ
    console.log("API Response:", data);

    // バリデーション: APIのレスポンスステータスが"ok"であることを確認
    if (data.status !== "ok") {
      return res.status(400).json({ error: "Invalid API response status.", details: data });
    }

    // 記事データを取得
    const { articles } = data;

    if (!articles || !Array.isArray(articles)) {
      return res.status(400).json({ error: "Invalid articles format. Expected an array of articles." });
    }

    // 最新50件のURLを取得
    const latestArticlesSnapshot = await db
      .collection("news")
      .orderBy("publishedAt", "desc") // 投稿日時で降順に並べ替え
      .limit(50) // 最新10件だけ取得
      .get();

    const existingUrls = new Set(
      latestArticlesSnapshot.docs.map((doc) => doc.data().url) // URLを抽出
    );

    // Firestoreのバッチ処理を開始
    const batch = db.batch();

    articles.forEach((article) => {
      if (existingUrls.has(article.url)) {
        // URLがすでに存在する場合はスキップ
        console.log(`Skipping duplicate article: ${article.url}`);
        return;
      }

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
    console.error("Error fetching or saving articles:", error);

    // エラーレスポンス
    res.status(500).json({ error: "Failed to fetch or save articles", details: error.message });
  }
}
