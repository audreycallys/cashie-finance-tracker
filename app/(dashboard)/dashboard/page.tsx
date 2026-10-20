"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Sparkles, Wallet } from "lucide-react";

import Header from "@/components/layout/Header";
import SummaryCard from "@/components/dashboard/SummaryCard";
import RecentTransactions, {
  type Transaction,
} from "@/components/dashboard/RecentTransactions";

type DashboardSummary = {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  totalTransactions: number;
  monthlyInsight: number;
};

type ApiTransaction = {
  id: number;
  name: string;
  category: string;
  date: string;
  amount: number;
  type: "income" | "expense";
};

type DashboardResponse = {
  summary: DashboardSummary;
  recentTransactions: ApiTransaction[];
  message?: string;
};

const initialSummary: DashboardSummary = {
  totalBalance: 0,
  totalIncome: 0,
  totalExpenses: 0,
  totalTransactions: 0,
  monthlyInsight: 0,
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

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary>(initialSummary);

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Ambil ringkasan dan transaksi terbaru dari MySQL.
  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/dashboard", {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load dashboard data. Please try again.");
      }

      const result: DashboardResponse = await response.json();

      setSummary(result.summary);

      // API mengirim YYYY-MM-DD.
      // Komponen RecentTransactions memakai tanggal
      // yang siap ditampilkan seperti 20 Oct 2026.
      const recentTransactions: Transaction[] = result.recentTransactions.map(
        (transaction) => ({
          id: transaction.id,
          name: transaction.name,
          category: transaction.category,
          date: formatDate(transaction.date),
          amount: transaction.amount,
          type: transaction.type,
        }),
      );

      setTransactions(recentTransactions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const summaryCards = [
    {
      title: "Total Balance",
      value: formatRupiah(summary.totalBalance),
      icon: Wallet,
      iconBg: "bg-balance-light",
      iconColor: "text-balance",
    },
    {
      title: "Total Income",
      value: formatRupiah(summary.totalIncome),
      icon: ArrowDownLeft,
      iconBg: "bg-income-light",
      iconColor: "text-income",
    },
    {
      title: "Total Expenses",
      value: formatRupiah(summary.totalExpenses),
      icon: ArrowUpRight,
      iconBg: "bg-expense-light",
      iconColor: "text-expense",
    },
    {
      title: "Monthly Insight",
      value: formatRupiah(summary.monthlyInsight),
      icon: Sparkles,
      iconBg: "bg-insight-light",
      iconColor: "text-insight",
    },
  ];

  return (
    <>
      <Header />

      {error && (
        <div
          role="alert"
          className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          <span>{error}</span>

          <button
            type="button"
            onClick={() => void loadDashboard()}
            className="font-semibold hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <SummaryCard
            key={card.title}
            title={card.title}
            value={loading ? "Loading..." : card.value}
            icon={card.icon}
            iconBg={card.iconBg}
            iconColor={card.iconColor}
          />
        ))}
      </section>

      {loading ? (
        <section
          className="mt-6 rounded-2xl border border-border bg-white p-7 text-sm text-text-secondary"
          role="status"
        >
          Loading recent transactions...
        </section>
      ) : (
        <RecentTransactions transactions={transactions} />
      )}
    </>
  );
}
