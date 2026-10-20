import Link from "next/link";

export type Transaction = {
  id: number;
  name: string;
  category: string;
  date: string;
  amount: number;
  type: "income" | "expense";
};

type RecentTransactionsProps = {
  transactions: Transaction[];
};

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function RecentTransactions({
  transactions,
}: RecentTransactionsProps) {
  return (
    <section className="mt-7 rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Recent Transactions
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            Your latest financial activities.
          </p>
        </div>

        <Link
          href="/transactions"
          className="text-sm font-medium text-primary transition-colors hover:text-primary-hover"
        >
          View All
        </Link>
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
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-12 text-center text-text-secondary"
                >
                  No transactions yet.
                </td>
              </tr>
            ) : (
              transactions.slice(0, 5).map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="py-4 font-medium text-text-primary">
                    {transaction.name}
                  </td>

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
                    {transaction.type === "income" ? "+" : "-"}
                    {formatRupiah(transaction.amount)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
