# JobTrack AI — Development Roadmap

## Implemented in the current workspace

### Foundation and authentication
- [x] Next.js App Router + TypeScript + Tailwind setup
- [x] Backend JWT session integration (HttpOnly cookies for the frontend proxy)
- [x] Email/password signup and login
- [x] Google and GitHub login flows
- [x] Protected dashboard/profile routes
- [x] Refresh-token renewal through the frontend backend proxy
- [x] Logout, change password, forgot password, and reset password

> The current project uses Fastify JWT sessions. Auth.js is not configured; the existing session flow was preserved.

### Core tracking
- [x] PostgreSQL models for users, jobs, notes, and reminders
- [x] Create, list, read, update, and delete job applications
- [x] Search, filter by status, sort by date, list/board views
- [x] Status updates across Wishlist, Applied, Assessment, Interview, Offer, and Rejected
- [x] Application details and recruiter contact information
- [x] Create, edit, and delete application notes
- [x] Create, complete, and delete reminders
- [x] Dashboard cards, recent applications, and upcoming reminders use live API data

### Analytics
- [x] Total, active, interview, offer, and rejection counts
- [x] Six-month application trend
- [x] Interview and offer rates
- [ ] Most active month/company and average time to interview

### AI tools
- [x] Interview-question generator (technical, behavioral, or mixed)
- [x] Save generated interview questions to an application's notes
- [x] PDF, DOCX, TXT, and Markdown resume upload/text extraction
- [x] Resume-to-job match score, strengths, skill gaps, and suggestions
- [x] Follow-up, thank-you, and salary-negotiation email drafts

### Reminder emails
- [x] Reminder email sender and protected cron-processing API
- [ ] Configure a hosting-provider cron schedule to call `POST /v1/cron/reminders`

## Remaining / later phases

### Board and productivity polish
- [ ] Drag-and-drop between board columns (status can currently be changed from a dropdown)
- [ ] Pagination controls in the frontend list (API pagination is available)
- [ ] Reminder edit/reschedule form
- [ ] Export applications to CSV

### Monetization
- [ ] Stripe integration and plans
- [ ] Free-user limits and premium features

### Launch
- [ ] Production environment variables and provider credentials
- [ ] Production database migration and deployment
- [ ] Responsive/mobile navigation polish
- [ ] SEO metadata, sitemap, and analytics integration
- [ ] E2E tests for signup-to-job-tracking flow

## Required configuration

- Backend: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`
- AI tools: backend `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL`
- Reminder emails: SMTP settings and `CRON_SECRET`; configure an external scheduler
- Frontend: `BACKEND_API_URL` and OAuth client IDs as needed
