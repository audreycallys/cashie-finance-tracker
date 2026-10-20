import { NextRequest, NextResponse } from "next/server";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

import pool from "@/lib/db";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { createTransactionSchema } from "@/validations/transaction";

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

// GET - Ambil transaksi milik pengguna yang login
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
    console.error("GET transactions error:", error);

    return NextResponse.json(
      { message: "Failed to load transactions." },
      { status: 500 },
    );
  }
}

// POST - Simpan transaksi baru
export async function POST(request: NextRequest) {
  try {
    // 1. Periksa session
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

    // 2. Baca request body
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON body." },
        { status: 400 },
      );
    }

    // 3. Validasi transaksi
    const validation = createTransactionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Validation failed.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, type, amount, category, date, description } = validation.data;

    // 4. Simpan transaksi ke database
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO transactions
        (user_id, name, type, amount, category, description, transaction_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [session.userId, name, type, amount, category, description, date],
    );

    // 5. Kirim transaksi yang berhasil dibuat
    return NextResponse.json(
      {
        message: "Transaction created successfully.",
        transaction: {
          id: result.insertId,
          name,
          type,
          amount,
          category,
          description,
          date,
        },
      },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("POST transactions error:", error);

    return NextResponse.json(
      { message: "Failed to create transaction." },
      { status: 500 },
    );
  }
}
