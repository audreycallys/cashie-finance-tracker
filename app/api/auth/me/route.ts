import { NextRequest, NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";

import pool from "@/lib/db";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export const runtime = "nodejs";

type UserRow = RowDataPacket & {
  id: number;
  name: string;
  email: string;
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

    const [users] = await pool.execute<UserRow[]>(
      "SELECT id, name, email FROM users WHERE id = ? LIMIT 1",
      [session.userId],
    );

    const user = users[0];

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Session lookup error:", error);

    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
