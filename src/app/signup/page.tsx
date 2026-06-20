import { Briefcase } from "lucide-react";
import Link from "next/link";
import GoogleButton from "@/components/auth/GoogleAuth";
import CredentialsForm from "@/components/auth/form";

export default function SignupPage() {
  return (
  
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-premium border border-slate-200/60 p-8 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="flex flex-col items-center text-center mb-5 relative z-10">
          <Link
            href="/"
            className="p-3 bg-indigo-50 hover:bg-indigo-100 transition-colors rounded-xl text-indigo-600 mb-6 group cursor-pointer"
          >
            <Briefcase className="w-8 h-8 group-hover:scale-105 transition-transform" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            Start tracking your job search with JobTrack AI
          </p>
        </div>

        <div className="relative z-10">
          <CredentialsForm />
          <GoogleButton />
        </div>
        <Link
          href="/login"
          className=" mx-auto block text-center text-xs text-indigo-700 mt-4 relative z-10"
        >
          Already have an account? Login here
        </Link>

        <p className="text-center text-xs text-slate-500 mt-2 relative z-10">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="underline hover:text-slate-800 transition-colors"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline hover:text-slate-800 transition-colors"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
  );
}
