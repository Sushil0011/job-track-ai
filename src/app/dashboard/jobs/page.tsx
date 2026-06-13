import { Search, Filter, MoreHorizontal } from "lucide-react";
import AddJobModal from "@/components/jobs/add-jobs";

export default function JobsPage() {
  // MOCK DATA: To be replaced with Drizzle DB call
  const jobs = [
    {
      id: "1",
      company: "Vercel",
      position: "Frontend Engineer",
      location: "Remote",
      salary: "$140k - $160k",
      status: "Interview",
      date: "Oct 24, 2026",
    },
    {
      id: "2",
      company: "Stripe",
      position: "Full Stack Developer",
      location: "San Francisco",
      salary: "$150k - $180k",
      status: "Assessment",
      date: "Oct 22, 2026",
    },
    {
      id: "3",
      company: "Netflix",
      position: "UI Engineer",
      location: "Los Gatos, CA",
      salary: "Unspecified",
      status: "Applied",
      date: "Oct 20, 2026",
    },
    {
      id: "4",
      company: "Google",
      position: "Software Engineer",
      location: "Mountain View",
      salary: "$160k - $190k",
      status: "Wishlist",
      date: "Oct 18, 2026",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Job Applications
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track and manage your entire job search pipeline.
          </p>
        </div>
        <AddJobModal />
      </div>

      {/* Toolbar: Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search companies or roles..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E43F3]/20 focus:border-[#5E43F3] bg-white"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
          <Filter className="w-4 h-4" />
          Filter by Status
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">
                  Company & Position
                </th>
                <th className="px-6 py-4 whitespace-nowrap">Location</th>
                <th className="px-6 py-4 whitespace-nowrap">Salary Range</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 whitespace-nowrap">Date Applied</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">
                      {job.company}
                    </p>
                    <p className="text-slate-500 mt-0.5">{job.position}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{job.location}</td>
                  <td className="px-6 py-4 text-slate-600">{job.salary}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                        job.status === "Wishlist"
                          ? "bg-slate-100 text-slate-700 border-slate-200"
                          : job.status === "Applied"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : job.status === "Assessment"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : job.status === "Interview"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">
                    {job.date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
