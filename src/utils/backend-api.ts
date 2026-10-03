export type JobStatus =
  | "WISHLIST"
  | "APPLIED"
  | "ASSESSMENT"
  | "INTERVIEW"
  | "OFFER"
  | "REJECTED";

export type Job = {
  id: string;
  companyName: string;
  position: string;
  jobUrl: string | null;
  location: string | null;
  salaryRange: string | null;
  recruiterName: string | null;
  recruiterEmail: string | null;
  recruiterPhone: string | null;
  status: JobStatus;
  applicationDate: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type Note = {
  id: string;
  jobId: string;
  content: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export type Reminder = {
  id: string;
  jobId: string;
  title: string;
  reminderDate: string;
  completed: boolean;
  notificationSentAt: string | null;
  companyName?: string;
  position?: string;
};

export type Analytics = {
  summary: {
    totalApplications: number;
    activeApplications: number;
    interviews: number;
    offers: number;
    rejections: number;
    interviewRate: number;
    offerRate: number;
  };
  statusBreakdown: Record<JobStatus, number>;
  trend: Array<{
    month: string;
    applications: number;
    interviews: number;
    offers: number;
  }>;
};

type ApiEnvelope<T> = {
  success?: boolean;
  statusCode?: number;
  data?: T;
  message?: string;
};

export async function backendFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  headers.set("Accept", "application/json");

  const response = await fetch(`/api/backend/${path.replace(/^\/+/, "")}`, {
    ...init,
    headers,
    cache: "no-store",
  });
  const body = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (!response.ok || body?.success === false) {
    throw new Error(body?.message ?? `Request failed (${response.status})`);
  }
  return body?.data as T;
}

export const backendGet = <T>(path: string) => backendFetch<T>(path);

export const backendSend = <T>(
  path: string,
  method: "POST" | "PATCH" | "DELETE",
  payload?: unknown,
) =>
  backendFetch<T>(path, {
    method,
    ...(payload === undefined
      ? {}
      : { body: payload instanceof FormData ? payload : JSON.stringify(payload) }),
  });

export const displayStatus = (status: JobStatus) =>
  status.charAt(0) + status.slice(1).toLowerCase();
