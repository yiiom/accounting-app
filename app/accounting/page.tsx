"use client";

import { useState } from "react";
import Link from "next/link"; // 匯入頁面連結功能
import Form from "./Form"; // 匯入拆分後的表單元件
import List from "./List"; // 匯入拆分後的列表元件

type Transaction = {    //交易紀錄
    id: number;
    type: string;
    amount: number;
    description: string;
};

export default function AccountingPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const total = transactions.reduce((sum, transaction) => {
        if (transaction.type === "收入") {
            return sum + transaction.amount; // 收入加到小計
        }

        return sum - transaction.amount; // 支出從小計扣除
    }, 0);

    function handleAdd(data: Omit<Transaction, "id">) {
        const newTransaction: Transaction = {
            id: Date.now(),
            ...data,
        };

        setTransactions([...transactions, newTransaction]); // 把新紀錄加入列表
    }

    return (
        <main className="accounting-page"> {/* 套用記帳頁面的樣式 */}


            <Form onAdd={handleAdd} /> {/* 顯示拆分後的記帳表單 */}

            <List
                transactions={transactions}
                onDelete={(id) =>
                    setTransactions(
                        transactions.filter((item) => item.id !== id),
                    )
                }
            /> {/* 顯示記帳列表和處理刪除 */}

            <p>小計：{total} 元</p> {/* 顯示收入扣除支出後的金額 */}

            <Link href="/" className="home-link">返回首頁</Link> {/* 返回首頁 */}
        </main>
    );
}
