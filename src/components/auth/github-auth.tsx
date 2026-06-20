"use client";
import { API_URL } from "@/utils/constant";
import { get } from "axify-js";

const GithubLogin = () => {
  const handleGithubLogin = async () => {
  try {
    const response = await get(`${API_URL}/auth/github`);
    console.log(response,"response");
  } catch (error) {
    console.log(error,"error");
  }
};

  return (
    <a
      href={`${API_URL}/auth/github`}
      className="mt-3 w-full flex items-center justify-center gap-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:border-slate-400"
    >
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 1.005 0 2.01.345 2.55 1.23.75-.24 1.56-.36 2.37-.36.81 0 1.62.12 2.37.36.54-.885 1.545-1.23 2.55-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.08.81 2.185 0 1.58-.015 2.85-.015 3.24 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
      Continue with GitHub
    </a>
  );
};

export default GithubLogin;