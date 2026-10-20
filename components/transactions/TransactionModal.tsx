"use client";

import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";

export type TransactionFormData = {
  name: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
  description: string;
};

type TransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TransactionFormData) => void;
  initialData?: TransactionFormData | null;
};

const categories = {
  income: ["Salary", "Freelance", "Business", "Other"],
  expense: [
    "Food & Drinks",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Other",
  ],
};

function getToday() {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

export default function TransactionModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: TransactionModalProps) {
  const [type, setType] = useState<"income" | "expense">(
    initialData?.type ?? "expense",
  );
  const [name, setName] = useState(initialData?.name ?? "");
  const [amount, setAmount] = useState(initialData?.amount?.toString() ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [date, setDate] = useState(initialData?.date ?? getToday());
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    setType(initialData?.type ?? "expense");
    setName(initialData?.name ?? "");
    setAmount(initialData?.amount?.toString() ?? "");
    setCategory(initialData?.category ?? "");
    setDate(initialData?.date ?? getToday());
    setDescription(initialData?.description ?? "");
    setError("");
  }, [initialData, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const numericAmount = Number(amount);

    if (!name.trim()) {
      setError("Transaction name is required.");
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    if (!category || !date) {
      setError("Please complete all required fields.");
      return;
    }

    onSave({
      name: name.trim(),
      type,
      amount: numericAmount,
      category,
      date,
      description: description.trim(),
    });
  }

  if (!isOpen) return null;

  const inputClass =
    "w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="transaction-modal-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl sm:p-8"
      >
        <div className="mb-7 flex items-start justify-between">
          <div>
            <h2
              id="transaction-modal-title"
              className="text-xl font-semibold text-text-primary"
            >
              {initialData ? "Edit Transaction" : "Add Transaction"}
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Fill in your transaction details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-2 text-text-secondary hover:bg-background-secondary"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Transaction type
            </label>

            <div className="grid grid-cols-2 gap-3">
              {(["income", "expense"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setType(value);
                    setCategory("");
                  }}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium capitalize ${
                    type === value
                      ? "border-primary bg-primary-light text-primary"
                      : "border-border text-text-secondary"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="transaction-name"
              className="mb-2 block text-sm font-medium"
            >
              Transaction name
            </label>
            <input
              id="transaction-name"
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Grocery Shopping"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="transaction-amount"
              className="mb-2 block text-sm font-medium"
            >
              Amount (Rp)
            </label>
            <input
              id="transaction-amount"
              type="number"
              min="1"
              step="1"
              required
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="Enter amount"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="transaction-category"
              className="mb-2 block text-sm font-medium"
            >
              Category
            </label>
            <select
              id="transaction-category"
              required
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className={inputClass}
            >
              <option value="">Select category</option>
              {categories[type].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="transaction-date"
              className="mb-2 block text-sm font-medium"
            >
              Date
            </label>
            <input
              id="transaction-date"
              type="date"
              required
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="transaction-description"
              className="mb-2 block text-sm font-medium"
            >
              Description (optional)
            </label>
            <textarea
              id="transaction-description"
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add a note..."
              className={`${inputClass} resize-none`}
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-5 py-3 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white hover:bg-primary-hover"
            >
              {initialData ? "Save Changes" : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
