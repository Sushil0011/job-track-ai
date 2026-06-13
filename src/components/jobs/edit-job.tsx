"use client";

import { useState } from "react";
import { X, PencilLine } from "lucide-react";

interface JobProps {
  company: string;
  position: string;
  jobUrl: string;
  location: string;
  salary: string;
  status: string;
  dateApplied: string;
}

export default function EditJobModal({ job }: { job: JobProps }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
      >
        <PencilLine className="w-4 h-4" />
        Edit Application
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-slate-900">
            Edit Application
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto">
          <form className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1.5 col-span-2 md:col-span-1">
                <label className="text-sm font-medium text-slate-700">
                  Company Name
                </label>
                <input
                  type="text"
                  defaultValue={job.company}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E43F3]/20 focus:border-[#5E43F3]"
                />
              </div>
              <div className="space-y-1.5 col-span-2 md:col-span-1">
                <label className="text-sm font-medium text-slate-700">
                  Position
                </label>
                <input
                  type="text"
                  defaultValue={job.position}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E43F3]/20 focus:border-[#5E43F3]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Job URL
              </label>
              <input
                type="url"
                defaultValue={job.jobUrl}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E43F3]/20 focus:border-[#5E43F3]"
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1.5 col-span-2 md:col-span-1">
                <label className="text-sm font-medium text-slate-700">
                  Location
                </label>
                <input
                  type="text"
                  defaultValue={job.location}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E43F3]/20 focus:border-[#5E43F3]"
                />
              </div>
              <div className="space-y-1.5 col-span-2 md:col-span-1">
                <label className="text-sm font-medium text-slate-700">
                  Salary Range
                </label>
                <input
                  type="text"
                  defaultValue={job.salary}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E43F3]/20 focus:border-[#5E43F3]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1.5 col-span-2 md:col-span-1">
                <label className="text-sm font-medium text-slate-700">
                  Status
                </label>
                <select
                  defaultValue={job.status.toUpperCase()}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E43F3]/20 focus:border-[#5E43F3] bg-white"
                >
                  <option value="WISHLIST">Wishlist</option>
                  <option value="APPLIED">Applied</option>
                  <option value="ASSESSMENT">Assessment</option>
                  <option value="INTERVIEW">Interview</option>
                  <option value="OFFER">Offer</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              <div className="space-y-1.5 col-span-2 md:col-span-1">
                <label className="text-sm font-medium text-slate-700">
                  Date Applied
                </label>
                <input
                  type="text"
                  defaultValue={job.dateApplied}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E43F3]/20 focus:border-[#5E43F3]"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 sticky bottom-0">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-[#5E43F3] hover:bg-[#4d36c9] rounded-lg transition-colors shadow-sm"
          >
            Update Application
          </button>
        </div>
      </div>
    </div>
  );
}
