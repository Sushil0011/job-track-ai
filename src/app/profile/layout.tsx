import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getUser } from "@/utils/apis";
import ProfileSidebar from "@/components/profile/profile-sidebar";

async function ProfileLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="grid w-full max-w-5xl mx-auto grid-cols-1 content-center lg:grid-cols-[280px_minmax(0,1fr)] gap-6 lg:gap-8 lg:items-center selection:bg-indigo-100 selection:text-indigo-900 lg:mt-16">
      <ProfileSidebar user={user} />
      <div className="min-w-0 bg-white rounded-2xl shadow-premium border border-slate-200/60 p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <ProfileLayoutContent>{children}</ProfileLayoutContent>
    </Suspense>
  );
}
