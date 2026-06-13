
import { Briefcase } from "lucide-react";
import Link from "next/link";
import User from "./User";

const Nav = () => {
  return (
    <nav className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-12 lg:px-24 sticky top-0 z-50">
      <Link href={"/"} className="flex items-center gap-2.5">
        <div className="p-1.5 bg-[#5E43F3] rounded-lg text-white flex items-center justify-center">
          <Briefcase className="w-5 h-5" strokeWidth={2.5} />
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-900">
          JobTrack AI
        </span>
      </Link>
     <User />
    </nav>
  );
};

export default Nav;
