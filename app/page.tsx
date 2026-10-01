import Link from "next/link"; // 匯入頁面連結功能
import styles from "./page.module.css"; // 匯入首頁樣式

export default function Home() {
  return (
    <main className={styles.home}> {/* 首頁最外層容器 */}
      <header className={styles.header}> {/* 深藍色標題區 */}
        <h1>React 練習專案</h1>
      </header>

      <section className={styles.welcome}> {/* 淺藍色歡迎區 */}
        <p>歡迎光臨我的頁面</p>
      </section>

      <section className={styles.start}> {/* 白色開始按鈕區 */}
        <Link href="/accounting">點此開始</Link> {/* 前往記帳頁面 */}
      </section>
    </main>
  );
}
