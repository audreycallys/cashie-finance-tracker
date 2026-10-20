import SummaryCard from "@/components/dashboard/SummaryCard";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

import {
  ArrowDownLeft,
  ArrowUpRight,
  LayoutDashboard,
  Plus,
  ReceiptText,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";

const summaryCards = [
  {
    title: "Total Balance",
    value: "Rp 14.870.000",
    icon: Wallet,
    iconBg: "bg-balance-light",
    iconColor: "text-balance",
  },
  {
    title: "Total Income",
    value: "Rp 12.500.000",
    icon: ArrowDownLeft,
    iconBg: "bg-income-light",
    iconColor: "text-income",
  },
  {
    title: "Total Expenses",
    value: "Rp 4.050.000",
    icon: ArrowUpRight,
    iconBg: "bg-expense-light",
    iconColor: "text-expense",
  },
  {
    title: "Monthly Insight",
    value: "Rp 2.100.000",
    icon: Sparkles,
    iconBg: "bg-insight-light",
    iconColor: "text-insight",
  },
];

const chartData = [
  { month: "May", income: 65, expense: 38 },
  { month: "Jun", income: 78, expense: 45 },
  { month: "Jul", income: 70, expense: 35 },
  { month: "Aug", income: 85, expense: 48 },
  { month: "Sep", income: 75, expense: 40 },
  { month: "Oct", income: 90, expense: 55 },
];

const transactions = [
  {
    name: "Monthly Salary",
    category: "Salary",
    date: "18 Oct 2026",
    amount: "+Rp 7.500.000",
    type: "income",
  },
  {
    name: "Grocery Shopping",
    category: "Food & Drinks",
    date: "17 Oct 2026",
    amount: "-Rp 250.000",
    type: "expense",
  },
  {
    name: "Freelance Project",
    category: "Freelance",
    date: "15 Oct 2026",
    amount: "+Rp 2.000.000",
    type: "income",
  },
  {
    name: "Transportation",
    category: "Transport",
    date: "14 Oct 2026",
    amount: "-Rp 75.000",
    type: "expense",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background-secondary text-text-primary">
      <div className="flex min-h-screen w-full bg-white">
        {/* Sidebar */}
        <Sidebar />

        {/* Main */}
        <main className="min-w-0 flex-1 bg-background-secondary px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
          {/* Header */}
          <Header />

          {/* Summary Cards */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <SummaryCard
                key={card.title}
                title={card.title}
                value={card.value}
                icon={card.icon}
                iconBg={card.iconBg}
                iconColor={card.iconColor}
              />
            ))}
          </section>

          {/* Recent transactions */}
          <section className="mt-7 rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Transactions</h2>
              <span className="text-sm font-medium text-primary">View All</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-text-secondary">
                    <th className="pb-4 font-medium">Transaction</th>
                    <th className="pb-4 font-medium">Category</th>
                    <th className="pb-4 font-medium">Date</th>
                    <th className="pb-4 text-right font-medium">Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((transaction) => (
                    <tr
                      key={`${transaction.name}-${transaction.date}`}
                      className="border-b border-border last:border-0"
                    >
                      <td className="py-4 font-medium">{transaction.name}</td>
                      <td className="py-4 text-text-secondary">
                        {transaction.category}
                      </td>
                      <td className="py-4 text-text-secondary">
                        {transaction.date}
                      </td>
                      <td
                        className={`py-4 text-right font-semibold ${
                          transaction.type === "income"
                            ? "text-income"
                            : "text-expense"
                        }`}
                      >
                        {transaction.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
