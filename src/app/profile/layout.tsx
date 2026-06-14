import { redirect } from "next/navigation";
import { getUser } from "@/utils/apis";
import ProfileSidebar from "@/components/profile/profile-sidebar";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-8 lg:py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
          <ProfileSidebar user={user} />
          <div className="min-w-0 bg-white rounded-2xl shadow-premium border border-slate-200/60 p-6 sm:p-8 lg:p-10 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
            <div className="relative z-10">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
