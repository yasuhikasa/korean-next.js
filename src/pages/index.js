import React from "react"; // 明示的にインポート
import styles from "../styles/Home.module.css";

export async function getServerSideProps() {
  let articles = [];

  try {
    const response = await fetch(
      "https://korean-front-c6081869e69e.herokuapp.com/api/news"
    ); // 本番環境ではURLを変更
    const data = await response.json();
    articles = data.articles || [];
  } catch (error) {
    console.error("Error fetching news:", error);
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
      <h1 className={styles.h1}>韓国専門ニュース</h1>
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
