import Head from 'next/head';
import styles from '../styles/Home.module.css';

export async function getServerSideProps() {
  const res = await fetch(
    `https://newsapi.org/v2/everything?q=korea&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
  );
  const data = await res.json();

  return {
    props: {
      articles: data.articles || [],
    },
  };
}

export default function Home({ articles }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>韓国専門ニュース</title>
        <meta name="description" content="韓国の最新ニュースとトレンドを毎日更新" />
      </Head>

      <header className={styles.header}>
        <h1 className={styles.h1}>韓国専門ニュース</h1>
      </header>

      <main className={styles.main}>
        <h2 className={styles.h2}>最新ニュース</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {articles.map((article, index) => (
            <div key={index} className={styles.card}>
              <img
                src={article.urlToImage || '/placeholder.jpg'}
                alt={article.title}
                className={styles.image}
              />
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                詳細を見る
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
