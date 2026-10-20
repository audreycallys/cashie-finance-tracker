import AuthVisual from "@/components/auth/AuthVisual";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <AuthVisual />

      <div className="flex min-h-screen items-center justify-center bg-white px-6 py-14 sm:px-10 lg:px-12">
        <div className="w-full max-w-[390px]">{children}</div>
      </div>
    </main>
  );
}
