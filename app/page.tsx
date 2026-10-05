"use client";
import { useEffect, useState } from "react"; // 管理狀態與設定監聽
import Link from "next/link"; // 匯入頁面連結功能
import styles from "./page.module.css"; // 匯入首頁樣式
import {
  createUserWithEmailAndPassword, // 註冊帳號
  signInWithEmailAndPassword, // 使用信箱與密碼登入
  onAuthStateChanged, // 監聽登入與登出狀態
  signOut, // 登出目前的會員
} from "firebase/auth";
import { auth } from "../lib/firebase"; // 使用已設定好的驗證服務
import type { User } from "firebase/auth"; // Firebase 使用者資料的型別

export default function Home() {
  const [email, setEmail] = useState(""); // 註冊信箱
  const [password, setPassword] = useState(""); // 註冊密碼
  const [loginEmail, setLoginEmail] = useState(""); // 登入信箱
  const [loginPassword, setLoginPassword] = useState(""); // 登入密碼
  const [user, setUser] = useState<User | null>(null); // 儲存目前登入的會員

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // 登入時存入會員資料，登出時存入 null
    });

    return () => unsubscribe(); // 元件離開時取消監聽
  }, []);

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // 避免送出表單後重新整理頁面

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("註冊成功"); // Firebase 建立帳號成功後才顯示
    } catch {
      alert("註冊失敗，請確認信箱、密碼，或信箱是否已被使用");
    }
  }
  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // 避免送出表單後重新整理頁面

    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      alert("登入成功"); // Firebase 確認登入成功後才顯示
    } catch {
      alert("登入失敗，請確認信箱與密碼，或稍後再試");
    }
  }
  async function handleLogout() {
    try {
      await signOut(auth); // 等待 Firebase 完成登出
      alert("已登出");
    } catch {
      alert("登出失敗，請稍後再試");
    }
  }

  return (
    <main className={styles.home}> {/* 首頁最外層容器 */}
      <header className={styles.header}> {/* 深藍色標題區 */}
        <h1>React 練習專案</h1>
      </header>
      <section className={styles.authSection}>
        {!user && <h2>登入系統</h2>}
                {/* 有登入會員時，才顯示信箱 */}
        {user && <p>您已經使用 {user.email} 登入</p>}
        {user && (
          <Link href="/accounting" className={styles.startButton}>
            立即開始
          </Link>
        )}
                {/* 有登入時才顯示登出按鈕 */}
        {user && (
          <button type="button" onClick={handleLogout} className={styles.startButton}>
            登出
          </button>
        )}
        {!user && (
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="login-email">電郵：</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={loginEmail}
              onChange={(event) => setLoginEmail(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="login-password">密碼：</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              required
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
            />
          </div>
          <button type="submit">登入</button>
        </form>
        )}
      </section>

      <section className={styles.authSection}>
        <h2>註冊帳戶</h2>

        <form onSubmit={handleRegister}>
          {/* htmlFor 對應 input 的 id，讓標籤與輸入框連結 */}
          <div>
            <label htmlFor="register-email">電郵：</label>
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              required
              value={email} //顯示 state 裡的信箱內容
              onChange={(event) => setEmail(event.target.value)} //每次打字時，把最新內容存進 email
            />
          </div>

          <div>
            <label htmlFor="register-password">密碼：</label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              minLength={6}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
            <button type="submit">註冊</button>
        </form>
      </section>
    </main>
  );
}
