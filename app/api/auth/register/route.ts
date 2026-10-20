import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ResultSetHeader, RowDataPacket } from "mysql2";

import pool from "@/lib/db";
import { registerSchema } from "@/validations/auth";

export const runtime = "nodejs";

type UserRow = RowDataPacket & {
  id: number;
};

export async function POST(request: NextRequest) {
  try {
    // 1. Ambil request body
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON body." },
        { status: 400 },
      );
    }

    // 2. Validasi input
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Validation failed.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, email, password } = validation.data;

    // 3. Cek apakah email sudah terdaftar
    const [existingUsers] = await pool.execute<UserRow[]>(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email],
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { message: "Email is already registered." },
        { status: 409 },
      );
    }

    // 4. Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // 5. Simpan akun ke database
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO users (name, email, password_hash)
       VALUES (?, ?, ?)`,
      [name, email, passwordHash],
    );

    // 6. Kirim respons tanpa password
    return NextResponse.json(
      {
        message: "Account created successfully.",
        user: {
          id: result.insertId,
          name,
          email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    // Tangani email duplikat yang masuk bersamaan.
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ER_DUP_ENTRY"
    ) {
      return NextResponse.json(
        { message: "Email is already registered." },
        { status: 409 },
      );
    }

    console.error("Register error:", error);

    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
