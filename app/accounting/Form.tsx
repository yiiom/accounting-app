"use client";

import { useRef, useState } from "react";

type FormData = {
  type: string;
  amount: number;
  description: string;
};

type FormProps = {
  onAdd: (data: FormData) => Promise<void>;
};

export default function Form({ onAdd }: FormProps) {
  const [type, setType] = useState("支出");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false); // 立即阻擋重複送出
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // 避免表單送出後重新整理
    if (submittingRef.current) return;
    setError("");

    if (amount.trim() === "" || description.trim() === "" || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      setError("請輸入大於 0 的金額與項目");
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    try {
    await onAdd({
      type: type,
      amount: Number(amount),
      description: description.trim(),
    }); // 把表單資料傳回 page.tsx

    setAmount(""); // 清空金額
    setDescription(""); // 清空項目
    } catch {
      setError("新增失敗，請確認登入狀態、網路與資料庫權限後再試。"); // 失敗時保留輸入
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <select
        disabled={isSubmitting}
        aria-label="收支類型"
        value={type}
        onChange={(event) => setType(event.target.value)}
      >
        <option value="支出">支出</option>
        <option value="收入">收入</option>
      </select>

      <input
        type="number"
        disabled={isSubmitting}
        aria-label="金額"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        placeholder="請輸入金額"
      />

      <input
        type="text"
        disabled={isSubmitting}
        aria-label="項目"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="例如：午餐"
      />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "儲存中…" : "新增紀錄"}
      </button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
