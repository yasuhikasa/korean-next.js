import React from "react"; // 明示的にインポート
import styles from "../styles/Home.module.css";
import { parseString } from "xml2js";

export async function getServerSideProps() {
  let articles = [];

  try {
    // 朝日新聞のRSSフィードURLを例として使用
    const response = await fetch("https://www.asahi.com/rss/asahi/newsheadlines.rdf"); // 本番環境ではURLを変更
    const xmlData = await response.text();
    
    // RSSフィードをJSONに変換
    parseString(xmlData, (err, result) => {
      if (err) {
        console.error("Error parsing RSS:", err);
        return;
      }

      const items = result.rss.channel[0].item;
      // 韓国に関連するニュースをフィルタリング（タイトルに「韓国」を含むもの）
      articles = items.filter(item => item.title[0].includes("韓国"));
    });
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
                  href={article.link[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.a}
                >
                  <h3>{article.title[0]}</h3>
                  <p className={styles.p}>{article.description[0]}</p>
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
