"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Search,
  Pencil,
  Trash2,
  ReceiptText,
} from "lucide-react";

import TransactionModal, {
  type TransactionFormData,
} from "@/components/transactions/TransactionModal";

type TransactionType = "income" | "expense";
type FilterType = "all" | TransactionType;

type Transaction = TransactionFormData & {
  id: number;
};

type TransactionsResponse = {
  transactions?: Transaction[];
  message?: string;
};

type TransactionResponse = {
  transaction?: Transaction;
  message?: string;
};

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
  // Transactions Data
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const saveInProgress = useRef(false);
  const deleteInProgress = useRef(false);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  // Add & Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  // Delete Modal
  const [deletingTransaction, setDeletingTransaction] =
    useState<Transaction | null>(null);

  // Feedback
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  // GET Transactions
  const loadTransactions = useCallback(async () => {
    try {
      setError("");

      const response = await fetch("/api/transactions", {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store",
      });

      const result: TransactionsResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load transactions.");
      }

      setTransactions(result.transactions ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load transactions.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Load Transactions
  useEffect(() => {
    void loadTransactions();
  }, [loadTransactions]);

  // Open Add Modal from Dashboard
  useEffect(() => {
    const url = new URL(window.location.href);

    if (url.searchParams.get("add") !== "true") {
      return;
    }

    setEditingTransaction(null);
    setIsModalOpen(true);

    // Hapus parameter setelah modal dibuka.
    url.searchParams.delete("add");

    window.history.replaceState(
      window.history.state,
      "",
      url.pathname + url.search + url.hash,
    );
  }, []);

  // Filter Transactions
  const filteredTransactions = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return transactions.filter((transaction) => {
      const matchesSearch =
        transaction.name.toLowerCase().includes(keyword) ||
        transaction.category.toLowerCase().includes(keyword);

      const matchesFilter = filter === "all" || transaction.type === filter;

      return matchesSearch && matchesFilter;
    });
  }, [transactions, search, filter]);

  // Open Add Modal
  function openAddModal() {
    if (saving || loading) return;

    setError("");
    setEditingTransaction(null);
    setIsModalOpen(true);
  }

  // Open Edit Modal
  function openEditModal(transaction: Transaction) {
    if (saving || deleting) return;

    setError("");
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  }

  // Close Modal
  function closeModal() {
    if (saving) return;

    setIsModalOpen(false);
    setEditingTransaction(null);
  }

  // POST / PATCH Transactions
  async function handleSave(data: TransactionFormData) {
    if (saveInProgress.current) return;

    saveInProgress.current = true;
    setSaving(true);
    setNotice("");
    setError("");

    const isEditing = editingTransaction !== null;

    const url = isEditing
      ? `/api/transactions/${editingTransaction.id}`
      : "/api/transactions";

    const method = isEditing ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify(data),
      });

      const result: TransactionResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save transaction.");
      }

      setIsModalOpen(false);
      setEditingTransaction(null);

      setNotice(
        isEditing
          ? "Transaction updated successfully."
          : "Transaction added successfully.",
      );

      await loadTransactions();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save transaction.",
      );
    } finally {
      saveInProgress.current = false;
      setSaving(false);
    }
  }

  // DELETE Transactions
  async function handleDelete() {
    if (!deletingTransaction || deleteInProgress.current) return;

    deleteInProgress.current = true;
    setDeleting(true);
    setNotice("");
    setError("");

    try {
      const response = await fetch(
        `/api/transactions/${deletingTransaction.id}`,
        {
          method: "DELETE",
          credentials: "same-origin",
        },
      );

      const result: { message?: string } = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete transaction.");
      }

      setDeletingTransaction(null);
      setNotice("Transaction deleted successfully.");

      await loadTransactions();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete transaction.",
      );
    } finally {
      deleteInProgress.current = false;
      setDeleting(false);
    }
  }

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
          onClick={openAddModal}
          disabled={saving || loading}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={18} />
          Add Transaction
        </button>
      </header>

      {/* Notice */}
      {notice && (
        <div
          role="status"
          className="mb-5 flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3 text-sm text-text-primary"
        >
          <span>{notice}</span>

          <button
            type="button"
            onClick={() => setNotice("")}
            className="font-medium text-primary"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            className="font-medium hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Transaction Table */}
      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              All Transactions
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              {loading
                ? "Loading transactions..."
                : `${filteredTransactions.length} transactions found`}
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
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-14 text-center text-text-secondary"
                  >
                    Loading transactions...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
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
                      {transactions.length === 0
                        ? "Add your first transaction to get started."
                        : "Try another keyword or filter."}
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
                      {/* Name */}
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

                      {/* Category */}
                      <td className="py-4 text-text-secondary">
                        {transaction.category}
                      </td>

                      {/* Date */}
                      <td className="py-4 text-text-secondary">
                        {formatDate(transaction.date)}
                      </td>

                      {/* Type */}
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

                      {/* Amount */}
                      <td
                        className={`py-4 text-right font-semibold ${
                          isIncome ? "text-income" : "text-expense"
                        }`}
                      >
                        {isIncome ? "+" : "-"}
                        {formatRupiah(transaction.amount)}
                      </td>

                      {/* Actions */}
                      <td className="py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(transaction)}
                            disabled={saving || deleting}
                            aria-label={`Edit ${transaction.name}`}
                            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-primary-light hover:text-primary disabled:opacity-50"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingTransaction(transaction)}
                            disabled={saving || deleting}
                            aria-label={`Delete ${transaction.name}`}
                            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
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

      {/* Add / Edit Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        initialData={editingTransaction}
      />

      {/* Delete Confirmation */}
      {deletingTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2
              id="delete-title"
              className="text-xl font-semibold text-text-primary"
            >
              Delete Transaction?
            </h2>

            <p className="mt-3 text-sm leading-6 text-text-secondary">
              Are you sure you want to delete{" "}
              <strong>{deletingTransaction.name}</strong>? This action cannot be
              undone.
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingTransaction(null)}
                disabled={deleting}
                className="rounded-xl border border-border px-5 py-3 text-sm font-medium disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl bg-red-500 px-5 py-3 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
