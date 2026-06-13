import {
  Briefcase,
  CheckCircle2,
  Clock,
  XCircle,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
// import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // Protect the route
//   const session = await auth();
//   if (!session?.user) {
//     redirect("/login");
//   }

  // MOCK DATA: Later, this will be fetched via Drizzle ORM
  const metrics = [
    {
      title: "Total Applications",
      value: "42",
      icon: Briefcase,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Active Interviews",
      value: "5",
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Offers Received",
      value: "2",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Rejections",
      value: "12",
      icon: XCircle,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Overview
        </h1>
        {/* <p className="text-sm text-slate-500 mt-1">
          Welcome back, {session.user.name?.split(" ")[0] || "User"}. Here is
          what's happening with your job search today.
        </p> */}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.title}
              className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {metric.title}
                  </p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {metric.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${metric.bg} ${metric.color}`}>
                  <Icon className="w-6 h-6" strokeWidth={2} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Activity (Takes up 2/3 space) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Applications
            </h2>
            <Link
              href="/dashboard/jobs"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View Board <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-0">
            {/* We will extract this to a separate component later */}
            <RecentJobsTable />
          </div>
        </div>

        {/* Right Column: Upcoming Reminders (Takes up 1/3 space) */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-indigo-600" />
              Upcoming Reminders
            </h2>
          </div>
          <div className="p-6 flex-1 flex flex-col gap-4">
            <ReminderItem
              company="Vercel"
              task="Technical Interview"
              date="Tomorrow, 2:00 PM"
            />
            <ReminderItem
              company="Stripe"
              task="Send Follow-up Email"
              date="Thursday, 10:00 AM"
            />
            <ReminderItem
              company="Netflix"
              task="Complete Assessment"
              date="Friday, 11:59 PM"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Local UI Components for the Dashboard ---
// (In a production app, these would be moved to src/components/dashboard/...)

function RecentJobsTable() {
  const jobs = [
    {
      id: 1,
      company: "Vercel",
      role: "Frontend Engineer",
      status: "Interview",
      date: "Oct 24",
    },
    {
      id: 2,
      company: "Stripe",
      role: "Full Stack Developer",
      status: "Assessment",
      date: "Oct 22",
    },
    {
      id: 3,
      company: "Netflix",
      role: "UI Engineer",
      status: "Applied",
      date: "Oct 20",
    },
    {
      id: 4,
      company: "Google",
      role: "Software Engineer",
      status: "Wishlist",
      date: "Oct 18",
    },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-500 font-medium">
          <tr>
            <th className="px-6 py-4">Company & Role</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Date Applied</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {jobs.map((job) => (
            <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4">
                <p className="font-semibold text-slate-900">{job.company}</p>
                <p className="text-slate-500 mt-0.5">{job.role}</p>
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={job.status} />
              </td>
              <td className="px-6 py-4 text-slate-500 font-medium">
                {job.date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Wishlist: "bg-slate-100 text-slate-700",
    Applied: "bg-blue-50 text-blue-700 border-blue-200",
    Assessment: "bg-purple-50 text-purple-700 border-purple-200",
    Interview: "bg-amber-50 text-amber-700 border-amber-200",
    Offer: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Rejected: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const style = styles[status] || styles.Wishlist;

  return (
    <span
      className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${style}`}
    >
      {status}
    </span>
  );
}

function ReminderItem({
  company,
  task,
  date,
}: {
  company: string;
  task: string;
  date: string;
}) {
  return (
    <div className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
      <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 shrink-0" />
      <div>
        <p className="font-semibold text-slate-900 text-sm">{company}</p>
        <p className="text-slate-600 text-sm mt-0.5">{task}</p>
        <p className="text-slate-400 text-xs font-medium mt-1">{date}</p>
      </div>
    </div>
  );
}
