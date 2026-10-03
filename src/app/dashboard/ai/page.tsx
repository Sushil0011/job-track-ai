"use client";

import { useEffect, useState } from "react";
import { BriefcaseBusiness, Check, ClipboardCopy, FileText, Loader2, Mail, MessageSquareText, Save, Sparkles, UploadCloud } from "lucide-react";
import { backendGet, backendSend, type Job } from "@/utils/backend-api";

type Tab = "questions" | "resume" | "email";
type QuestionsResult = { questions: Array<{ type: string; question: string; whyItMatters: string; answerTip: string }> };
type ResumeResult = { matchScore: number; summary: string; strengths: string[]; missingSkills: string[]; recommendations: string[]; keywordsToHighlight?: string[] };
type EmailResult = { subject: string; body: string; suggestedSendTiming?: string };

const tabs: Array<{ id: Tab; title: string; description: string; icon: typeof Sparkles }> = [
  { id: "questions", title: "Interview prep", description: "Practice questions for a role", icon: MessageSquareText },
  { id: "resume", title: "Resume match", description: "Compare a resume with a job", icon: FileText },
  { id: "email", title: "Email writer", description: "Draft a thoughtful message", icon: Mail },
];

export default function AiToolsPage() {
  const [tab, setTab] = useState<Tab>("questions");
  const [linkedJob, setLinkedJob] = useState<Job | null>(null);
  const [linkMessage, setLinkMessage] = useState("");

  useEffect(() => {
    const jobId = new URLSearchParams(window.location.search).get("jobId");
    if (!jobId) return;
    void backendGet<{ job: Job }>(`jobs/${encodeURIComponent(jobId)}`).then(({ job }) => {
      setLinkedJob(job);
      setLinkMessage(`Using ${job.position} at ${job.companyName} as a starting point.`);
    }).catch(() => setLinkMessage("The linked application could not be loaded; you can still use the tools."));
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-violet-50 p-6 sm:p-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#5E43F3] shadow-sm"><Sparkles className="h-3.5 w-3.5" />JobTrack AI</span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">AI tools for your next move</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Prepare for interviews, see how your resume aligns with a role, and write a follow-up email. Review every AI draft before sending.</p>
        {linkMessage && <p className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-indigo-800"><BriefcaseBusiness className="h-4 w-4" />{linkMessage}</p>}
      </div>

      <div className="grid gap-3 md:grid-cols-3" role="tablist" aria-label="AI tools">
        {tabs.map(({ id, title, description, icon: Icon }) => <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`rounded-xl border p-4 text-left transition-colors ${tab === id ? "border-[#5E43F3] bg-indigo-50 ring-2 ring-indigo-100" : "border-slate-200 bg-white hover:border-slate-300"}`}>
          <Icon className={`h-5 w-5 ${tab === id ? "text-[#5E43F3]" : "text-slate-500"}`} /><span className="mt-3 block text-sm font-semibold text-slate-900">{title}</span><span className="mt-1 block text-xs text-slate-500">{description}</span>
        </button>)}
      </div>

      {tab === "questions" && <InterviewPrep key={linkedJob?.id ?? "standalone"} linkedJob={linkedJob} />}
      {tab === "resume" && <ResumeMatch key={linkedJob?.id ?? "standalone"} linkedJob={linkedJob} />}
      {tab === "email" && <EmailWriter key={linkedJob?.id ?? "standalone"} linkedJob={linkedJob} />}
    </div>
  );
}

function InterviewPrep({ linkedJob }: { linkedJob: Job | null }) {
  const [jobTitle, setJobTitle] = useState(linkedJob?.position ?? "");
  const [companyName, setCompanyName] = useState(linkedJob?.companyName ?? "");
  const [jobDescription, setJobDescription] = useState("");
  const [questionType, setQuestionType] = useState("mixed");
  const [result, setResult] = useState<QuestionsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setLoading(true); setError(""); setSaved(false);
    try {
      const data = await backendSend<QuestionsResult>("ai/questions", "POST", { jobTitle, companyName, jobDescription, questionType, count: 8 });
      setResult(data);
    } catch (err) { setError(err instanceof Error ? err.message : "Could not generate questions"); }
    finally { setLoading(false); }
  };

  const saveToNotes = async () => {
    if (!linkedJob || !result) return;
    setSaving(true); setError("");
    try {
      const content = `AI interview prep — ${jobTitle} at ${companyName}\n\n${result.questions.map((item, index) => `${index + 1}. ${item.question}\nWhy it matters: ${item.whyItMatters}\nAnswer tip: ${item.answerTip}`).join("\n\n")}`;
      await backendSend("notes", "POST", { jobId: linkedJob.id, content }); setSaved(true);
    } catch (err) { setError(err instanceof Error ? err.message : "Could not save questions"); }
    finally { setSaving(false); }
  };

  return <ToolPanel icon={<MessageSquareText className="h-5 w-5" />} title="Interview question generator" description="Create a focused practice set based on the role and job description.">
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <Field label="Job title" required value={jobTitle} onChange={setJobTitle} placeholder="Product designer" />
      <Field label="Company" value={companyName} onChange={setCompanyName} placeholder="Company name" />
      <label className="space-y-1.5 text-sm font-medium text-slate-700">Question style<select value={questionType} onChange={(event) => setQuestionType(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal"><option value="mixed">Mixed</option><option value="technical">Technical</option><option value="behavioral">Behavioral</option></select></label>
      <label className="space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2">Job description<textarea value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} maxLength={12000} rows={5} placeholder="Paste the job description for more tailored questions…" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal focus:border-[#5E43F3] focus:outline-none focus:ring-2 focus:ring-[#5E43F3]/20" /></label>
      <div className="sm:col-span-2"><SubmitButton loading={loading} label="Generate questions" /></div>
    </form>
    {error && <ErrorText>{error}</ErrorText>}
    {result && <div className="mt-6 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-semibold text-slate-900">Your practice questions</h3>{linkedJob && <button onClick={() => void saveToNotes()} disabled={saving || saved} className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 px-3 py-2 text-xs font-semibold text-[#5E43F3] hover:bg-indigo-50 disabled:opacity-60"><Save className="h-3.5 w-3.5" />{saved ? "Saved to application notes" : saving ? "Saving…" : "Save to application"}</button>}</div>
      {result.questions.map((question, index) => <article key={`${index}-${question.question}`} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"><div className="flex items-start gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-[#5E43F3]">{index + 1}</span><div><span className="text-[10px] font-semibold uppercase tracking-wider text-[#5E43F3]">{question.type.replaceAll("_", " ")}</span><p className="mt-1 font-semibold text-slate-900">{question.question}</p><p className="mt-2 text-xs leading-5 text-slate-500"><strong>Why:</strong> {question.whyItMatters}</p><p className="mt-1 text-xs leading-5 text-slate-500"><strong>Answer tip:</strong> {question.answerTip}</p></div></div></article>)}
    </div>}
  </ToolPanel>;
}

function ResumeMatch({ linkedJob }: { linkedJob: Job | null }) {
  const [jobTitle, setJobTitle] = useState(linkedJob?.position ?? "");
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ResumeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) { setError("Choose a PDF, DOCX, TXT, or Markdown resume file."); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const form = new FormData(); form.append("resume", file); form.append("jobTitle", jobTitle); form.append("jobDescription", jobDescription);
      const data = await backendSend<ResumeResult>("ai/resume-analysis", "POST", form);
      setResult(data);
    } catch (err) { setError(err instanceof Error ? err.message : "Could not analyze this resume"); }
    finally { setLoading(false); }
  };

  return <ToolPanel icon={<FileText className="h-5 w-5" />} title="Resume analyzer" description="Upload a resume and compare its skills and experience with a target role. Files are analyzed in memory and aren’t stored.">
    <form onSubmit={submit} className="space-y-4">
      <Field label="Target job title" value={jobTitle} onChange={setJobTitle} placeholder="Software engineer" />
      <label className="space-y-1.5 text-sm font-medium text-slate-700">Job description<textarea required minLength={20} maxLength={14000} value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} rows={5} placeholder="Paste the full job description…" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal focus:border-[#5E43F3] focus:outline-none focus:ring-2 focus:ring-[#5E43F3]/20" /></label>
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center hover:border-[#5E43F3] hover:bg-indigo-50/40"><UploadCloud className="h-7 w-7 text-[#5E43F3]" /><span className="text-sm font-semibold text-slate-800">{file ? file.name : "Choose your resume"}</span><span className="text-xs text-slate-500">PDF, DOCX, TXT or MD · up to 5 MB</span><input type="file" accept=".pdf,.docx,.txt,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="sr-only" /></label>
      <SubmitButton loading={loading} label="Analyze resume" />
    </form>
    {error && <ErrorText>{error}</ErrorText>}
    {result && <div className="mt-6 space-y-5">
      <div className="flex flex-col items-center gap-4 rounded-xl border border-indigo-100 bg-indigo-50/70 p-5 sm:flex-row"><div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full border-8 border-indigo-200 bg-white"><span className="text-2xl font-bold text-[#5E43F3]">{result.matchScore}</span><span className="text-[10px] font-semibold uppercase text-slate-500">match</span></div><div><h3 className="font-semibold text-slate-900">Resume match overview</h3><p className="mt-1 text-sm leading-6 text-slate-600">{result.summary}</p><p className="mt-2 text-[11px] text-slate-500">AI feedback is an estimate—review it before making decisions.</p></div></div>
      <div className="grid gap-4 md:grid-cols-2"><ResultList title="Strengths" items={result.strengths} good /><ResultList title="Skills to address" items={result.missingSkills} /><ResultList title="Suggested improvements" items={result.recommendations} /><ResultList title="Keywords to highlight" items={result.keywordsToHighlight ?? []} /></div>
    </div>}
  </ToolPanel>;
}

function EmailWriter({ linkedJob }: { linkedJob: Job | null }) {
  const [companyName, setCompanyName] = useState(linkedJob?.companyName ?? "");
  const [position, setPosition] = useState(linkedJob?.position ?? "");
  const [contactName, setContactName] = useState("");
  const [purpose, setPurpose] = useState("follow_up");
  const [tone, setTone] = useState("professional");
  const [context, setContext] = useState("");
  const [result, setResult] = useState<EmailResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setLoading(true); setError(""); setCopied(false);
    try { setResult(await backendSend<EmailResult>("ai/followup-email", "POST", { companyName, position, contactName, purpose, tone, context })); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not draft the email"); }
    finally { setLoading(false); }
  };

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(`Subject: ${result.subject}\n\n${result.body}`);
    setCopied(true);
  };

  return <ToolPanel icon={<Mail className="h-5 w-5" />} title="Email generator" description="Create a follow-up, thank-you, or salary negotiation draft. Edit the result to match your real experience and voice.">
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <Field label="Company" required value={companyName} onChange={setCompanyName} placeholder="Company name" />
      <Field label="Position" required value={position} onChange={setPosition} placeholder="Role title" />
      <Field label="Contact name (optional)" value={contactName} onChange={setContactName} placeholder="Hiring manager" />
      <label className="space-y-1.5 text-sm font-medium text-slate-700">Email purpose<select value={purpose} onChange={(event) => setPurpose(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal"><option value="follow_up">Application follow-up</option><option value="thank_you">Interview thank-you</option><option value="salary_negotiation">Salary negotiation</option></select></label>
      <label className="space-y-1.5 text-sm font-medium text-slate-700">Tone<select value={tone} onChange={(event) => setTone(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal"><option value="professional">Professional</option><option value="warm">Warm</option><option value="concise">Concise</option></select></label>
      <label className="space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2">Useful context (optional)<textarea value={context} onChange={(event) => setContext(event.target.value)} maxLength={4000} rows={4} placeholder="For example: I interviewed on Tuesday with the platform team…" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal focus:border-[#5E43F3] focus:outline-none focus:ring-2 focus:ring-[#5E43F3]/20" /></label>
      <div className="sm:col-span-2"><SubmitButton loading={loading} label="Draft email" /></div>
    </form>
    {error && <ErrorText>{error}</ErrorText>}
    {result && <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-semibold text-slate-900">Draft email</h3><button onClick={() => void copy()} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">{copied ? <Check className="h-4 w-4 text-emerald-600" /> : <ClipboardCopy className="h-4 w-4" />}{copied ? "Copied" : "Copy draft"}</button></div><p className="mt-4 text-sm"><strong className="text-slate-500">Subject:</strong> <span className="font-medium text-slate-900">{result.subject}</span></p><pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-6 text-slate-700">{result.body}</pre>{result.suggestedSendTiming && <p className="mt-4 border-t border-slate-200 pt-3 text-xs text-slate-500">Suggested timing: {result.suggestedSendTiming}</p>}</div>}
  </ToolPanel>;
}

function ToolPanel({ icon, title, description, children }: { icon: React.ReactNode; title: string; description: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><div className="mb-6 flex gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#5E43F3]">{icon}</span><div><h2 className="text-lg font-semibold text-slate-900">{title}</h2><p className="mt-1 text-sm leading-5 text-slate-500">{description}</p></div></div>{children}</section>;
}
function Field({ label, value, onChange, placeholder, required = false }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; required?: boolean }) {
  return <label className="space-y-1.5 text-sm font-medium text-slate-700">{label}<input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal text-slate-800 focus:border-[#5E43F3] focus:outline-none focus:ring-2 focus:ring-[#5E43F3]/20" /></label>;
}
function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#5E43F3] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#4d36c9] disabled:cursor-not-allowed disabled:opacity-60">{loading && <Loader2 className="h-4 w-4 animate-spin" />}{loading ? "Working…" : label}</button>;
}
function ErrorText({ children }: { children: React.ReactNode }) {
  return <p role="alert" className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">{children}</p>;
}
function ResultList({ title, items, good = false }: { title: string; items: string[]; good?: boolean }) {
  return <div className="rounded-xl border border-slate-200 p-4"><h4 className="text-sm font-semibold text-slate-900">{title}</h4>{items.length ? <ul className="mt-3 space-y-2">{items.map((item, index) => <li key={`${index}-${item}`} className="flex gap-2 text-sm leading-5 text-slate-600"><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${good ? "bg-emerald-500" : "bg-amber-400"}`} />{item}</li>)}</ul> : <p className="mt-3 text-xs text-slate-400">No items returned.</p>}</div>;
}
