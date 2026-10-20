"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  const hour = currentDate?.getHours() ?? 12;

  const greeting = !currentDate
    ? "Welcome back!"
    : hour < 12
      ? "Good morning!"
      : hour < 18
        ? "Good afternoon!"
        : "Good evening!";

  const formattedDate = currentDate
    ? currentDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  function handleAddTransaction() {
    router.push("/transactions?add=true");
  }

  return (
    <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
      <div>
        <p className="mb-3 text-sm text-text-secondary">{formattedDate}</p>

        <h1 className="text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
          {greeting}
        </h1>

        <p className="mt-3 text-text-secondary">
          Here&apos;s your financial overview.
        </p>
      </div>

      <button
        type="button"
        onClick={handleAddTransaction}
        className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-white transition-colors hover:bg-primary-hover"
      >
        <Plus size={18} />
        Add Transaction
      </button>
    </header>
  );
}
