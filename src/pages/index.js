import fs from 'fs';
import path from 'path';

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'public', 'news.json');
  let articles = [];

  try {
    // ファイルが存在するか確認し、読み込む
    if (fs.existsSync(filePath)) {
      const jsonData = fs.readFileSync(filePath, 'utf-8');
      articles = JSON.parse(jsonData).articles || [];
    } else {
      console.warn('news.json does not exist. Returning empty articles.');
    }
  } catch (error) {
    console.error('Error reading news.json:', error);
  }

  return {
    props: {
      articles,
    },
    revalidate: 3600, // キャッシュ時間（秒）
  };
}

export default function Home({ articles }) {
  return (
    <div>
      <h1>韓国専門ニュース</h1>
      <main>
        <h2>最新ニュース</h2>
        {articles.length > 0 ? (
          <ul>
            {articles.map((article, index) => (
              <li key={index}>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>現在ニュースがありません。</p>
        )}
      </main>
    </div>
  );
}
