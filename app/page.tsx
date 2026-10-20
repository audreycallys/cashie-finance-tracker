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
    Icon: Wallet,
    iconBg: "bg-balance-light",
    iconColor: "text-balance",
  },
  {
    title: "Total Income",
    value: "Rp 12.500.000",
    Icon: ArrowDownLeft,
    iconBg: "bg-income-light",
    iconColor: "text-income",
  },
  {
    title: "Total Expenses",
    value: "Rp 4.050.000",
    Icon: ArrowUpRight,
    iconBg: "bg-expense-light",
    iconColor: "text-expense",
  },
  {
    title: "Monthly Insight",
    value: "Rp 2.100.000",
    Icon: Sparkles,
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
        <aside className="hidden min-h-screen w-60 shrink-0 border-r border-border bg-white px-5 py-9 md:block">
          <div className="mb-16 flex items-center gap-3 px-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-xl font-bold text-white">
              C
            </div>
            <span className="text-2xl font-bold tracking-tight">
              cashie<span className="text-primary">.</span>
            </span>
          </div>

          <nav className="space-y-2">
            <div className="flex items-center gap-3 rounded-xl bg-primary-light px-4 py-3 font-semibold text-primary">
              <LayoutDashboard size={19} />
              Dashboard
            </div>

            <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-text-secondary">
              <ReceiptText size={19} />
              Transactions
            </div>
          </nav>

          <div className="mt-12 border-t border-border pt-5">
            <p className="px-3 text-xs text-text-secondary">
              Your money, made simple.
            </p>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1 bg-background-secondary px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
          {/* Header */}
          <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-3 text-sm text-text-secondary">
                Sunday, October 18, 2026
              </p>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Good evening!
              </h1>
              <p className="mt-3 text-text-secondary">
                Here&apos;s your financial overview.
              </p>
            </div>

            <button
              type="button"
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-white transition-colors hover:bg-primary-hover"
            >
              <Plus size={18} />
              Add Transaction
            </button>
          </header>

          {/* Summary cards */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <article
                key={card.title}
                className="rounded-2xl border border-border bg-white p-5 shadow-sm"
              >
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg}`}
                >
                  <card.Icon
                    size={23}
                    className={card.iconColor}
                    strokeWidth={2}
                  />
                </div>

                <p className="text-sm text-text-secondary">{card.title}</p>

                <h2 className="mt-2 text-[clamp(1.1rem,1.6vw,1.5rem)] font-semibold tracking-tight text-text-primary">
                  {card.value}
                </h2>
              </article>
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

          <p className="mt-6 text-center text-xs text-text-secondary">
            Cashie. — Design system preview (mock data)
          </p>
        </main>
      </div>
    </div>
  );
}
