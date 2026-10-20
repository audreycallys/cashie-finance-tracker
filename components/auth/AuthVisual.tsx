import Link from "next/link";
import { ArrowUpRight, Wallet } from "lucide-react";

export default function AuthVisual() {
  return (
    <div className="relative hidden min-h-screen overflow-hidden bg-[#DDEAFF] p-12 lg:flex lg:flex-col lg:justify-between xl:p-16">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/60" />
      <div className="pointer-events-none absolute -bottom-44 -left-36 h-96 w-96 rounded-full border border-white/60" />

      {/* Brand */}
      <Link
        href="/login"
        className="relative z-10 flex w-fit items-center gap-3"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white">
          C
        </div>
        <span className="text-2xl font-bold tracking-tight text-text-primary">
          cashie<span className="text-primary">.</span>
        </span>
      </Link>

      {/* Headline */}
      <div className="relative z-10 max-w-lg">
        <span className="inline-flex rounded-full bg-white/60 px-4 py-2 text-xs font-semibold text-primary">
          Personal finance, simplified
        </span>

        <h1 className="mt-6 text-5xl font-semibold leading-[1.1] tracking-tight text-text-primary xl:text-6xl">
          Take control
          <br />
          of your money.
        </h1>

        <p className="mt-6 max-w-sm text-base leading-7 text-[#617B70]">
          Build better habits, make smarter choices, and feel confident about
          your financial future.
        </p>
      </div>

      {/* Decorative balance card */}
      <div className="relative z-10 flex justify-end pb-8 pr-6">
        <div className="w-64 rotate-[-5deg] rounded-2xl border border-white bg-white/95 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary">Total balance</span>
            <ArrowUpRight size={17} className="text-income" />
          </div>

          <p className="mt-5 text-2xl font-bold text-text-primary">
            Rp 8.450.000
          </p>

          <div className="mt-6 flex items-center gap-2 rounded-lg bg-income-light px-3 py-2">
            <Wallet size={16} className="text-income" />
            <span className="text-xs font-medium text-income">
              Your finances, organized.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
