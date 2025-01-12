import React from "react"; // 明示的にインポート
import styles from "../styles/Home.module.css";
import { parseString } from "xml2js";

// XMLのパースをPromiseでラップして非同期に処理
const parseXml = (xmlData) => {
  return new Promise((resolve, reject) => {
    parseString(xmlData, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

export async function getServerSideProps() {
  let articles = [];

  try {
    console.log("Fetching RSS feed from: https://www.asahi.com/rss/asahi/newsheadlines.rdf");
    const response = await fetch("https://www.asahi.com/rss/asahi/newsheadlines.rdf");
    const xmlData = await response.text();

    console.log("RSS feed successfully fetched. Parsing RSS...");

    // RSSフィードをJSONに変換
    const result = await parseXml(xmlData);

    // RDF形式のRSSフィードに対応
    console.log("Parsed RSS result:", result);

    // RDFの場合、'rdf:RDF' の下に 'channel' があることを確認
    if (result['rdf:RDF'] && result['rdf:RDF'][0] && result['rdf:RDF'][0].item) {
      const items = result['rdf:RDF'][0].item;

      console.log("Found items. Filtering Korean news...");

      // 韓国に関連するニュースをフィルタリング（タイトルに「韓国」を含むもの）
      articles = items.filter(item => item.title[0].includes("韓国"));

      console.log(`${articles.length} articles found related to "韓国".`);
    } else {
      console.error("RDF feed structure is unexpected. 'rdf:RDF' or 'item' not found.");
      throw new Error("RSSフィードの構造が期待と異なります。'rdf:RDF' または 'item'が存在しません。");
    }
  } catch (error) {
    console.error("Error fetching or parsing news:", error);
    articles = [];
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
