"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Search,
  Pencil,
  Trash2,
  ReceiptText,
} from "lucide-react";

type TransactionType = "income" | "expense";
type FilterType = "all" | TransactionType;

type Transaction = {
  id: number;
  name: string;
  category: string;
  date: string;
  amount: number;
  type: TransactionType;
};

const transactions: Transaction[] = [
  {
    id: 1,
    name: "Monthly Salary",
    category: "Salary",
    date: "2026-10-18",
    amount: 7500000,
    type: "income",
  },
  {
    id: 2,
    name: "Grocery Shopping",
    category: "Food & Drinks",
    date: "2026-10-17",
    amount: 250000,
    type: "expense",
  },
  {
    id: 3,
    name: "Freelance Project",
    category: "Freelance",
    date: "2026-10-15",
    amount: 2000000,
    type: "income",
  },
  {
    id: 4,
    name: "Transportation",
    category: "Transport",
    date: "2026-10-14",
    amount: 75000,
    type: "expense",
  },
];

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const keyword = search.toLowerCase().trim();

      const matchesSearch =
        transaction.name.toLowerCase().includes(keyword) ||
        transaction.category.toLowerCase().includes(keyword);

      const matchesFilter = filter === "all" || transaction.type === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  return (
    <div>
      {/* Page Header */}
      <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="mb-3 text-sm text-text-secondary">
            Transactions overview
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
            Transactions
          </h1>

          <p className="mt-3 text-text-secondary">
            Manage and track your financial activities.
          </p>
        </div>

        <button
          type="button"
          disabled
          title="Available in the next development stage"
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed"
        >
          <Plus size={18} />
          Add Transaction
        </button>
      </header>

      {/* Transaction Table */}
      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              All Transactions
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              {filteredTransactions.length} transactions found
            </p>
          </div>

          <div className="flex w-full flex-wrap gap-3 sm:w-auto">
            {/* Search */}
            <div className="relative min-w-[180px] flex-1 sm:w-60">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
              />
              <input
                type="search"
                aria-label="Search transactions"
                placeholder="Search transactions..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
              />
            </div>

            {/* Filter */}
            <select
              aria-label="Filter transaction type"
              value={filter}
              onChange={(event) => setFilter(event.target.value as FilterType)}
              className="rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-text-secondary">
                <th className="pb-4 font-medium">Transaction</th>
                <th className="pb-4 font-medium">Category</th>
                <th className="pb-4 font-medium">Date</th>
                <th className="pb-4 font-medium">Type</th>
                <th className="pb-4 text-right font-medium">Amount</th>
                <th className="pb-4 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center">
                    <ReceiptText
                      size={28}
                      className="mx-auto mb-3 text-text-secondary"
                    />
                    <p className="font-medium text-text-primary">
                      No transactions found
                    </p>
                    <p className="mt-1 text-sm text-text-secondary">
                      Try another keyword or filter.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => {
                  const isIncome = transaction.type === "income";

                  return (
                    <tr
                      key={transaction.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                              isIncome
                                ? "bg-income-light text-income"
                                : "bg-expense-light text-expense"
                            }`}
                          >
                            {isIncome ? (
                              <ArrowDownLeft size={19} />
                            ) : (
                              <ArrowUpRight size={19} />
                            )}
                          </div>
                          <span className="font-medium text-text-primary">
                            {transaction.name}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 text-text-secondary">
                        {transaction.category}
                      </td>

                      <td className="py-4 text-text-secondary">
                        {formatDate(transaction.date)}
                      </td>

                      <td className="py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            isIncome
                              ? "bg-income-light text-income"
                              : "bg-expense-light text-expense"
                          }`}
                        >
                          {isIncome ? "Income" : "Expense"}
                        </span>
                      </td>

                      <td
                        className={`py-4 text-right font-semibold ${
                          isIncome ? "text-income" : "text-expense"
                        }`}
                      >
                        {isIncome ? "+" : "-"}
                        {formatRupiah(transaction.amount)}
                      </td>

                      <td className="py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            disabled
                            aria-label={`Edit ${transaction.name}`}
                            title="Available in the next stage"
                            className="rounded-lg p-2 text-text-secondary disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            disabled
                            aria-label={`Delete ${transaction.name}`}
                            title="Available in the next stage"
                            className="rounded-lg p-2 text-text-secondary disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
