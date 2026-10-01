"use client";

type Transaction = {
  id: number;
  type: string;
  amount: number;
  description: string;
};

type ListProps = {
  transactions: Transaction[];
  onDelete: (id: number) => void;
};

export default function List({ transactions, onDelete }: ListProps) {
  return (
    <ul>
      {transactions.map((transaction) => (
        <li key={transaction.id}>
          <span
            className={
              transaction.type === "收入" ? "income" : "expense"
            }
          >
            {transaction.type === "支出" ? "-" : ""}
            {transaction.amount}
          </span> {/* 顯示收入或支出金額 */}

          <span>{transaction.description}</span> {/* 顯示項目名稱 */}

          <button
            type="button"
            onClick={() => onDelete(transaction.id)}
          >
            刪除
          </button> {/* 刪除這一筆紀錄 */}
        </li>
      ))}
    </ul>
  );
}