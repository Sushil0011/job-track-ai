import { Briefcase } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import User from "./User";

function SignInFallback() {
  return (
    <Link
      href="/login"
      className="text-sm font-medium text-white bg-[#5E43F3] hover:bg-[#5e43f3] px-5 py-2.5 rounded-lg transition-all duration-200 shadow-premium hover:shadow-premium-hover"
    >
      Sign In
    </Link>
  );
}

const Nav = () => {
  return (
    <nav className="h-18 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-12 lg:px-24 sticky top-0 z-50">
      <Link href={"/"} className="flex items-center gap-2.5">
        <div className="p-1.5 bg-[#5E43F3] rounded-lg text-white flex items-center justify-center">
          <Briefcase className="w-5 h-5" strokeWidth={2.5} />
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-900">
          JobTrack AI
        </span>
      </Link>
      <Suspense fallback={<SignInFallback />}>
        <User />
      </Suspense>
    </nav>
  );
};

export default Nav;
