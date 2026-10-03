import { Briefcase } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import User from "./user";

function SignInFallback() {
  return (
    <Link href="/login" className="rounded-lg bg-[#5E43F3] px-5 py-2 text-sm font-medium text-white transition-all hover:bg-[#4d36c9]">
      Sign in
    </Link>
  );
}

const Nav = () => {
  return (
    <nav className="sticky top-0 z-50 flex min-h-[72px] items-center justify-between gap-4 border-b border-slate-100 bg-white px-4 sm:px-6 lg:px-12">
      <Link href="/" className="flex shrink-0 items-center gap-2.5">
        <span className="flex items-center justify-center rounded-lg bg-[#5E43F3] p-1.5 text-white"><Briefcase className="h-6 w-6" strokeWidth={2.5} /></span>
        <span className="text-lg font-bold tracking-tight text-slate-900">JobTrack AI</span>
      </Link>
      <div className="hidden items-center gap-1 md:flex">
        <NavLink href="/dashboard">Dashboard</NavLink>
        <NavLink href="/dashboard/jobs">Applications</NavLink>
        <NavLink href="/dashboard/analytics">Analytics</NavLink>
        <NavLink href="/dashboard/ai">AI tools</NavLink>
      </div>
      <Suspense fallback={<SignInFallback />}><User /></Suspense>
    </nav>
  );
};

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#5E43F3]">{children}</Link>;
}

export default Nav;
