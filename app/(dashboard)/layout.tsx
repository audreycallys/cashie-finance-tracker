import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
