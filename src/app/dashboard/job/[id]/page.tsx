import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Link as LinkIcon,
  User,
  Mail,
  Phone,
  Plus,
  AlignLeft,
  Clock,
} from "lucide-react";
import EditJobModal from "@/components/jobs/edit-job";


export default function JobDetailsPage({ params }: { params: { id: string } }) {
  // MOCK DATA: Later, you will fetch this specific job using `params.id` via Drizzle
  const job = {
    id: params.id,
    company: "Vercel",
    position: "Frontend Engineer",
    location: "Remote",
    salary: "$140k - $160k",
    jobUrl: "https://vercel.com/careers/frontend",
    status: "Interview",
    dateApplied: "Oct 24, 2026",
    recruiter: {
      name: "Aagya Jha",
      email: "aagya@vercel.com",
      phone: "+1 (555) 019-2834",
    },
    notes: [
      {
        id: 1,
        text: "Focused heavily on Next.js App Router experience during the screening call. Make sure to review React Server Components.",
        date: "Oct 26, 2026",
      },
      {
        id: 2,
        text: "Applied via referral from former colleague.",
        date: "Oct 24, 2026",
      },
    ],
    reminders: [
      {
        id: 1,
        text: "Technical Interview with Engineering Manager",
        date: "Tomorrow, 2:00 PM",
      },
      { id: 2, text: "Send thank you email", date: "Tomorrow, 4:00 PM" },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation / Back Button */}
      <div>
        <Link
          href="/dashboard/jobs"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Link>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {job.position}
            </h1>
            <div className="flex items-center gap-3 mt-2 text-slate-600">
              <span className="flex items-center gap-1.5 font-medium text-slate-900">
                <Building2 className="w-4 h-4 text-slate-400" />
                {job.company}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                {job.location}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-sm font-semibold rounded-full border bg-amber-50 text-amber-700 border-amber-200">
              {job.status}
            </span>
            {/* <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
              Edit Application
            </button> */}
            <EditJobModal job={job} />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* LEFT COLUMN: Details & Notes (Takes 2/3 space) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Job Details Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-[0_2px_10px_rgb(0,0,0,0.02)] p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Application Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" /> Salary Range
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {job.salary}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> Date Applied
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {job.dateApplied}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-1.5">
                  <LinkIcon className="w-4 h-4" /> Job URL
                </p>
                <a
                  href={job.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-[#5E43F3] hover:underline break-all"
                >
                  {job.jobUrl}
                </a>
              </div>
            </div>
          </div>

          {/* Notes Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <AlignLeft className="w-5 h-5 text-slate-400" />
                Interview Notes
              </h2>
            </div>

            <div className="p-6 bg-slate-50/50 border-b border-slate-100">
              <textarea
                placeholder="Jot down interview questions, research, or thoughts..."
                className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E43F3]/20 focus:border-[#5E43F3] min-h-[100px] resize-y bg-white"
              ></textarea>
              <div className="flex justify-end mt-3">
                <button className="px-4 py-2 bg-[#5E43F3] hover:bg-[#4d36c9] text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                  Save Note
                </button>
              </div>
            </div>

            <div className="p-0 divide-y divide-slate-100">
              {job.notes.map((note) => (
                <div
                  key={note.id}
                  className="p-6 hover:bg-slate-50/50 transition-colors"
                >
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {note.text}
                  </p>
                  <p className="text-xs font-medium text-slate-400 mt-3">
                    {note.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Recruiter & Reminders (Takes 1/3 space) */}
        <div className="space-y-8">
          {/* Recruiter Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-[0_2px_10px_rgb(0,0,0,0.02)] p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-slate-400" />
              Recruiter Details
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                  Name
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {job.recruiter.name}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                  Email
                </p>
                <a
                  href={`mailto:${job.recruiter.email}`}
                  className="text-sm font-medium text-[#5E43F3] hover:underline flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" /> {job.recruiter.email}
                </a>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                  Phone
                </p>
                <a
                  href={`tel:${job.recruiter.phone}`}
                  className="text-sm font-medium text-slate-700 hover:text-slate-900 flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" /> {job.recruiter.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Reminders Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-400" />
                Reminders
              </h2>
              <button className="p-1.5 text-slate-400 hover:text-[#5E43F3] hover:bg-indigo-50 rounded-md transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 flex flex-col gap-2">
              {job.reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="p-3 border border-slate-100 rounded-lg bg-slate-50 flex items-start gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#5E43F3] mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {reminder.text}
                    </p>
                    <p className="text-xs font-medium text-slate-500 mt-1">
                      {reminder.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
