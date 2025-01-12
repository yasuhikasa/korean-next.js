import admin from 'firebase-admin';

// Firebase Admin SDK初期化
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_JSON);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const newsData = req.body; // リクエストボディからデータを取得
    const articles = newsData.articles || [];

    // Firestoreにデータをバッチ保存
    const batch = db.batch();
    articles.forEach((article, index) => {
      const ref = db.collection('news').doc(`article-${Date.now()}-${index}`);
      batch.set(ref, article);
    });
    await batch.commit();

    res.status(200).json({ message: 'News uploaded successfully' });
  } catch (error) {
    console.error('Error uploading news:', error);
    res.status(500).json({ error: 'Failed to upload news' });
  }
}