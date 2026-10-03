# JobTrack AI frontend

Next.js 16 App Router frontend for the JobTrack AI application tracker. The UI talks to the Fastify backend through a same-origin server proxy, which keeps access/refresh tokens in HttpOnly cookies and forwards authenticated requests to the API.

## Local setup

1. Start the backend and PostgreSQL database. Follow the backend repository README and apply its Drizzle schema changes.
2. Copy `.env.example` to `.env.local` and configure `BACKEND_API_URL` and any OAuth client IDs.
3. Install and run the frontend:

   ```bash
   npm install
   npm run dev
   ```

   Open `http://localhost:3000`.

`BACKEND_API_URL` should point to the backend API base, normally `http://localhost:4000/v1`. `NEXT_PUBLIC_API_URL` is used by the direct GitHub OAuth redirect link and should use the same `/v1` base URL.

## Features

- Email/password, Google, and GitHub sign-in; password reset and profile settings
- Job application create/list/detail/update/delete, search, status filter, list/board view
- Notes and reminders for each application
- Dashboard summary and six-month analytics
- AI interview-question generator, resume analyzer, and email writer
- Due reminder email processing is scheduled by calling the backend's protected cron endpoint

The existing Fastify JWT session was retained; Auth.js is not configured in this repository.

## AI configuration

Set `AI_API_KEY`, `AI_BASE_URL`, and `AI_MODEL` on the backend only. Resume files are uploaded to the backend for in-memory parsing and are not saved by the application.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — start the production server
- `npm run lint` — ESLint checks
- `npm run preview` — Cloudflare/OpenNext preview
- `npm run deploy` — Cloudflare/OpenNext deployment
