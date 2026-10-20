import { NextRequest, NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";

import pool from "@/lib/db";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TransactionRow = RowDataPacket & {
  id: number;
  name: string;
  type: "income" | "expense";
  amount: string;
  category: string;
  description: string | null;
  date: string;
};

export async function GET(request: NextRequest) {
  try {
    // Ambil token dari cookie
    const token = request.cookies.get(SESSION_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    // Verifikasi session pengguna
    const session = await verifySessionToken(token);

    if (!session) {
      return NextResponse.json(
        { message: "Invalid or expired session." },
        { status: 401 },
      );
    }

    // Ambil hanya transaksi milik pengguna yang login
    const [rows] = await pool.execute<TransactionRow[]>(
      `SELECT
        id,
        name,
        type,
        amount,
        category,
        description,
        DATE_FORMAT(transaction_date, '%Y-%m-%d') AS date
      FROM transactions
      WHERE user_id = ?
      ORDER BY transaction_date DESC, id DESC`,
      [session.userId],
    );

    // Konversi DECIMAL MySQL menjadi number untuk UI
    const transactions = rows.map((row) => ({
      id: row.id,
      name: row.name,
      type: row.type,
      amount: Number(row.amount),
      category: row.category,
      description: row.description ?? "",
      date: row.date,
    }));

    return NextResponse.json(
      { transactions },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      },
    );
  } catch (error) {
    console.error("Get transactions error:", error);

    return NextResponse.json(
      { message: "Failed to load transactions." },
      { status: 500 },
    );
  }
}
