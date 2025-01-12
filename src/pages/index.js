import fs from 'fs';
import path from 'path';

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'public', 'news.json');
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  const articles = JSON.parse(jsonData).articles;

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
      </main>
    </div>
  );
}

