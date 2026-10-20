import { NextRequest, NextResponse } from "next/server";
import type { ResultSetHeader } from "mysql2";

import pool from "@/lib/db";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { createTransactionSchema } from "@/validations/transaction";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// Ambil identitas pengguna dari session
async function getCurrentUserId(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (!token) return null;

  const session = await verifySessionToken(token);

  return session?.userId ?? null;
}

// Validasi ID transaksi
function parseTransactionId(id: string) {
  const parsed = Number(id);

  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(parsed)) {
    return null;
  }

  return parsed;
}

// PATCH - Edit transaksi
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    // 1. Periksa session
    const userId = await getCurrentUserId(request);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    // 2. Validasi ID transaksi
    const { id } = await context.params;
    const transactionId = parseTransactionId(id);

    if (!transactionId) {
      return NextResponse.json(
        { message: "Invalid transaction ID." },
        { status: 400 },
      );
    }

    // 3. Baca JSON
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON body." },
        { status: 400 },
      );
    }

    // 4. Validasi data
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

    // 5. Update hanya transaksi milik pengguna
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE transactions
       SET
         name = ?,
         type = ?,
         amount = ?,
         category = ?,
         description = ?,
         transaction_date = ?
       WHERE id = ? AND user_id = ?`,
      [name, type, amount, category, description, date, transactionId, userId],
    );

    // 6. Transaksi tidak ditemukan / bukan milik user
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Transaction not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Transaction updated successfully.",
      transaction: {
        id: transactionId,
        name,
        type,
        amount,
        category,
        description,
        date,
      },
    });
  } catch (error) {
    console.error("PATCH transaction error:", error);

    return NextResponse.json(
      { message: "Failed to update transaction." },
      { status: 500 },
    );
  }
}

// DELETE - Hapus transaksi
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // 1. Periksa session
    const userId = await getCurrentUserId(request);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    // 2. Validasi ID transaksi
    const { id } = await context.params;
    const transactionId = parseTransactionId(id);

    if (!transactionId) {
      return NextResponse.json(
        { message: "Invalid transaction ID." },
        { status: 400 },
      );
    }

    // 3. Hapus hanya transaksi milik pengguna
    const [result] = await pool.execute<ResultSetHeader>(
      `DELETE FROM transactions
       WHERE id = ? AND user_id = ?`,
      [transactionId, userId],
    );

    // 4. Jika transaksi tidak ditemukan
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Transaction not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Transaction deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE transaction error:", error);

    return NextResponse.json(
      { message: "Failed to delete transaction." },
      { status: 500 },
    );
  }
}
