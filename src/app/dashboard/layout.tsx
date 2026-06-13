
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-900">
      <main className="px-6 md:px-12 lg:px-24 py-10 max-w-[1600px] mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
