import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import Sidebar from "@/components/layout/Sidebar";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Ambil cookie session dari browser
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  // Jika belum login, arahkan ke halaman Login
  if (!token) {
    redirect("/login");
  }

  // Verifikasi keaslian dan masa berlaku session
  const session = await verifySessionToken(token);

  // Jika session tidak valid atau kedaluwarsa
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background-secondary text-text-primary">
      <div className="flex min-h-screen w-full">
        <Sidebar />

        <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
          {children}
        </main>
      </div>
    </div>
  );
}
