"use client";

import { useState } from "react";

type FormData = {
  type: string;
  amount: number;
  description: string;
};

type FormProps = {
  onAdd: (data: FormData) => void;
};

export default function Form({ onAdd }: FormProps) {
  const [type, setType] = useState("支出");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // 避免表單送出後重新整理

    if (amount === "" || description === "") {
      alert("請輸入金額和項目"); // 檢查欄位是否有資料
      return;
    }

    onAdd({
      type: type,
      amount: Number(amount),
      description: description,
    }); // 把表單資料傳回 page.tsx

    setAmount(""); // 清空金額
    setDescription(""); // 清空項目
  }

  return (
    <form onSubmit={handleSubmit}>
      <select
        value={type}
        onChange={(event) => setType(event.target.value)}
      >
        <option value="支出">支出</option>
        <option value="收入">收入</option>
      </select>

      <input
        type="number"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        placeholder="請輸入金額"
      />

      <input
        type="text"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="例如：午餐"
      />

      <button type="submit">新增紀錄</button>
    </form>
  );
}