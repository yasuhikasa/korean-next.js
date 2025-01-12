import fs from 'fs';
import path from 'path';
import styles from '../styles/Home.module.css';

export async function getServerSideProps() {
  const filePath = path.join(process.cwd(), 'public', 'news.json');
  let articles = [];

  try {
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
  };
}

export default function Home({ articles }) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.h1}>韓国専門ニュース</h1>
      </header>
      <main className={styles.main}>
        <h2 className={styles.h2}>最新ニュース</h2>
        {articles.length > 0 ? (
          <ul className={styles.ul}>
            {articles.map((article, index) => (
              <li key={index} className={styles.li}>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.a}
                >
                  <h3>{article.title}</h3>
                  <p className={styles.p}>{article.description}</p>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.p}>現在ニュースがありません。</p>
        )}
      </main>
    </div>
  );
}
