"use client";

import { useEffect, useState } from "react"; // 管理狀態與設定登入監聽
import Link from "next/link"; // 匯入頁面連結功能
import Form from "./Form"; // 匯入拆分後的表單元件
import List from "./List"; // 匯入拆分後的列表元件
import { onAuthStateChanged } from "firebase/auth"; // 監聽登入狀態
import { auth, db } from "../../lib/firebase"; // 使用驗證與資料庫服務
import type { User } from "firebase/auth"; // Firebase 會員資料的型別
import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore"; // 新增、讀取與刪除紀錄
type Transaction = {    //交易紀錄
    id: string;
    type: string;
    amount: number;
    description: string;
};

export default function AccountingPage() {  // 建立並匯出記帳頁元件
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [user, setUser] = useState<User | null>(null); // 儲存目前登入的會員
    const [authLoading, setAuthLoading] = useState(true); // 是否正在確認登入狀態
    const [dataLoading, setDataLoading] = useState(true); // 是否正在讀取記帳紀錄
    const [dataError, setDataError] = useState(""); // 儲存讀取記帳紀錄失敗的提示
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setTransactions([]); // 登入狀態改變時，清除畫面上的舊紀錄
            setDataError(""); // 清除上次的錯誤提示
            setDataLoading(currentUser !== null); // 有會員時，準備讀取該會員的資料
            setUser(currentUser); // 更新目前登入的會員
            setAuthLoading(false); // 已完成登入狀態確認
        });

        return () => unsubscribe(); // 離開頁面時取消監聽
    }, []);
    useEffect(() => {
        if (!user) return; // 沒有登入會員就不讀取資料
        let cancelled = false; // 離開頁面或切換會員後，將忽略這次讀取結果

        const transactionsRef = collection(
            db,
            "users",
            user.uid,
            "transactions"
        ); // 指定要讀取目前會員的記帳集合

        async function loadTransactions() {
            try {
                const snapshot = await getDocs(transactionsRef); // 取得目前會員的紀錄
                    if (cancelled) return; // 讀取已過期，就不再處理結果
                const records: Transaction[] = snapshot.docs.map((document) => {
                    const data = document.data(); // 取得這筆紀錄的欄位
                    // 確認資料格式，避免錯誤資料影響列表與小計
                    if (
                        (data.type !== "收入" && data.type !== "支出") ||
                        typeof data.amount !== "number" ||
                        !Number.isFinite(data.amount) ||
                        data.amount <= 0 ||
                        typeof data.description !== "string" ||
                        data.description.trim() === ""
                    ) {
                        throw new Error("記帳資料格式不正確");
                    }

                    return {
                        id: document.id, // 使用 Firestore 的紀錄 ID
                        type: data.type,
                        amount: data.amount,
                        description: data.description,
                    };
                });
                setTransactions(records); // 將資料庫紀錄放進列表，並重新計算小計
            } catch {
                if (!cancelled) {
                    setDataError("讀取紀錄失敗，請稍後再試"); // 只顯示本次有效讀取的錯誤
                }
            } finally {
                if (!cancelled) {
                    setDataLoading(false); // 讀取結束，停止等待
                }
            }
        }
        loadTransactions(); // 執行讀取目前會員的記帳紀錄
        return () => {
            cancelled = true; // 離開頁面或切換會員時，標記這次讀取已過期
        };
    }, [user]);

    const total = transactions.reduce((sum, transaction) => {
        if (transaction.type === "收入") {
            return sum + transaction.amount; // 收入加到小計
        }

        return sum - transaction.amount; // 支出從小計扣除
    }, 0);

    async function handleAdd(data: Omit<Transaction, "id">) {
        if (!user) {
            throw new Error("請先登入"); // 交由表單顯示失敗提示
        }

        const transactionsRef = collection(
            db,
            "users",
            user.uid,
            "transactions"
        ); // 指向目前會員的記帳集合

        const documentRef = await addDoc(transactionsRef, data); // 資料庫成功後才更新畫面
        if (auth.currentUser?.uid !== user.uid) return; // 避免切換會員後顯示舊會員的新紀錄
        const newTransaction: Transaction = {
            id: documentRef.id, // 使用 Firestore 產生的紀錄 ID
            ...data,
        };

        setTransactions((previous) => [...previous, newTransaction]); // 保留等待期間的其他更新
    }
    async function handleDelete(id: string) {
        if (!user) {
            alert("請先登入");
            return; // 未登入時停止刪除
        }

        const transactionRef = doc(
            db,
            "users",
            user.uid,
            "transactions",
            id
        ); // 指向目前會員要刪除的那筆紀錄
        try {
            await deleteDoc(transactionRef); // 資料庫刪除成功後才繼續

            if (auth.currentUser?.uid !== user.uid) return; // 避免影響已切換的會員

            setTransactions((previous) =>
                previous.filter((item) => item.id !== id)
            ); // 從畫面移除該筆紀錄，並更新小計
        } catch {
            alert("刪除失敗，請稍後再試"); // 失敗時保留畫面上的紀錄
        }
    }
    if (authLoading || dataLoading) {
        return <p>正在載入會員與記帳資料…</p>; // 等待確認登入及讀取完成
    }
    if (!user) {
        return (
            <main>
                <p>請先登入，才能使用記帳功能。</p>
                <Link href="/">返回首頁登入</Link>
            </main>
        );
    }
    if (dataError) {
        return (
            <main>
                <p role="alert">{dataError}</p>
                <Link href="/">返回首頁</Link>
            </main>
        );
    }
    return (
        <main className="accounting-page"> {/* 套用記帳頁面的樣式 */}


            <Form onAdd={handleAdd} /> {/* 顯示拆分後的記帳表單 */}

            <List
                transactions={transactions}
                onDelete={handleDelete}
            /> {/* 顯示記帳列表，並透過資料庫刪除紀錄 */}

            <p>小計：{total} 元</p> {/* 顯示收入扣除支出後的金額 */}

            <Link href="/" className="home-link">返回首頁</Link> {/* 返回首頁 */}
        </main>
    );
}
