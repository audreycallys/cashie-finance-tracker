import { ArrowDownLeft, ArrowUpRight, Sparkles, Wallet } from "lucide-react";

import Header from "@/components/layout/Header";
import SummaryCard from "@/components/dashboard/SummaryCard";
import RecentTransactions, {
  type Transaction,
} from "@/components/dashboard/RecentTransactions";

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

const transactions: Transaction[] = [
  {
    id: 1,
    name: "Monthly Salary",
    category: "Salary",
    date: "18 Oct 2026",
    amount: 7500000,
    type: "income",
  },
  {
    id: 2,
    name: "Grocery Shopping",
    category: "Food & Drinks",
    date: "17 Oct 2026",
    amount: 250000,
    type: "expense",
  },
  {
    id: 3,
    name: "Freelance Project",
    category: "Freelance",
    date: "15 Oct 2026",
    amount: 2000000,
    type: "income",
  },
  {
    id: 4,
    name: "Transportation",
    category: "Transport",
    date: "14 Oct 2026",
    amount: 75000,
    type: "expense",
  },
];

export default function DashboardPage() {
  return (
    <>
      <Header />

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

      <RecentTransactions transactions={transactions} />
    </>
  );
}
