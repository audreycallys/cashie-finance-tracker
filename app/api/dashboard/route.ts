import { NextRequest, NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";

import pool from "@/lib/db";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SummaryRow = RowDataPacket & {
  total_income: string;
  total_expenses: string;
  total_transactions: number;
  monthly_income: string;
  monthly_expenses: string;
};

type RecentTransactionRow = RowDataPacket & {
  id: number;
  name: string;
  category: string;
  date: string;
  amount: string;
  type: "income" | "expense";
};

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const session = await verifySessionToken(token);

    if (!session) {
      return NextResponse.json(
        { message: "Invalid or expired session." },
        { status: 401 },
      );
    }

    const userId = session.userId;

    const [summaryRows] = await pool.execute<SummaryRow[]>(
      `SELECT
         COALESCE(
           SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END),
           0
         ) AS total_income,

         COALESCE(
           SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END),
           0
         ) AS total_expenses,

         COUNT(*) AS total_transactions,

         COALESCE(
           SUM(
             CASE
               WHEN type = 'income'
                 AND YEAR(transaction_date) = YEAR(CURDATE())
                 AND MONTH(transaction_date) = MONTH(CURDATE())
               THEN amount
               ELSE 0
             END
           ),
           0
         ) AS monthly_income,

         COALESCE(
           SUM(
             CASE
               WHEN type = 'expense'
                 AND YEAR(transaction_date) = YEAR(CURDATE())
                 AND MONTH(transaction_date) = MONTH(CURDATE())
               THEN amount
               ELSE 0
             END
           ),
           0
         ) AS monthly_expenses
       FROM transactions
       WHERE user_id = ?`,
      [userId],
    );

    const [recentRows] = await pool.execute<RecentTransactionRow[]>(
      `SELECT
           id,
           name,
           category,
           DATE_FORMAT(transaction_date, '%Y-%m-%d') AS date,
           amount,
           type
         FROM transactions
         WHERE user_id = ?
         ORDER BY transaction_date DESC, id DESC
         LIMIT 5`,
      [userId],
    );

    const summary = summaryRows[0];

    const totalIncome = Number(summary?.total_income ?? 0);
    const totalExpenses = Number(summary?.total_expenses ?? 0);
    const totalTransactions = Number(summary?.total_transactions ?? 0);
    const monthlyIncome = Number(summary?.monthly_income ?? 0);
    const monthlyExpenses = Number(summary?.monthly_expenses ?? 0);

    const recentTransactions = recentRows.map((row) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      date: row.date,
      amount: Number(row.amount),
      type: row.type,
    }));

    return NextResponse.json(
      {
        summary: {
          totalBalance: totalIncome - totalExpenses,
          totalIncome,
          totalExpenses,
          totalTransactions,
          monthlyInsight: monthlyIncome - monthlyExpenses,
        },
        recentTransactions,
      },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      },
    );
  } catch (error) {
    console.error("Dashboard API error:", error);

    return NextResponse.json(
      { message: "Failed to load dashboard." },
      { status: 500 },
    );
  }
}
