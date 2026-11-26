# Rabin Portfolio — Master Project Plan

**Project:** Rabin Humagain Developer Portfolio  
**Repository:** https://github.com/rabin0811/rabin-portfolio  
**Local working directory:** `D:\\deploy\\rabin-portfolio`  
**Reviewed snapshot:** 25 November 2026  
**Status:** Existing application; improvement and verification phase. Deployment is intentionally postponed.

## 1. Purpose

Maintain and improve a professional portfolio website with a public-facing profile and an authenticated administration area. The public site presents the owner's introduction, skills, certifications, projects, blog content, gallery, contact information and resume. The admin area manages relevant portfolio content and incoming messages.

## 2. Current technology (observed in the supplied project snapshot)

- Frontend: React 19, Vite 8, React Router 7, Axios, Tailwind CSS, Framer Motion and Recharts.
- Backend: Node.js with Express 5.
- Data layer: PostgreSQL with Prisma 7 and the PostgreSQL adapter.
- Authentication-related packages/features: bcryptjs, JWT and Google authentication integration.
- Other backend features/packages: Nodemailer, Multer and local upload directories.

Do not assume a production hosting provider or production database is configured. Verify environment files and deployment settings before deployment.

## 3. Work already present in the codebase

The supplied snapshot contains:

- React application entry points, routing/application shell and theme context.
- Public portfolio sections: Hero, About, Skills, Certifications, Projects, Blog, Contact, Footer and portfolio slideshow.
- Admin pages: login, registration, dashboard, messages, projects, blogs, gallery and resumes.
- Express server and API route groups for authentication, admin profile, analytics, blogs, contact, gallery, projects, uploads, visitors and resumes.
- Prisma schema containing Admin, Project, Blog, Contact, GalleryImage and Resume models.
- Upload middleware and sample files in `server/uploads`.
- A seed script and Prisma configuration/client files.
- Initial Markdown documentation was prepared separately; merge it into the repository root as described in `DOCUMENTATION_GUIDE.md`.

**Important:** Presence of code does not prove that a feature works correctly. Runtime, integration, security and production tests are still required.

## 4. Development phases

### Phase 0 — Project baseline and documentation
- [ ] Place the Markdown documentation in the repository root.
- [ ] Confirm the current Git branch and working-tree status.
- [ ] Install dependencies using the existing lockfiles.
- [ ] Run frontend lint and production build.
- [ ] Run backend build/check scripts.
- [ ] Record all errors before changing code.

### Phase 1 — Security and access control
- [ ] Restrict analytics endpoints and remove exposure of private contact-message content.
- [ ] Ensure admin profile responses return only safe public/admin-needed fields, never password hashes or reset credentials.
- [ ] Review every route's public/protected access and verify authorization in controllers.
- [ ] Verify project visibility rules for public endpoints.
- [ ] Review login, registration, Google login and password-reset flows.
- [ ] Add suitable rate limits and input validation where needed.
- [ ] Review upload validation, file names, file size limits and allowed file types.

### Phase 2 — Database reliability
- [ ] Inspect the current PostgreSQL database and Prisma migration history.
- [ ] Repair/create a valid migration baseline only after confirming the real database state.
- [ ] Test migrations and seed process on a disposable development database.
- [ ] Verify backup and recovery approach.

### Phase 3 — Backend quality
- [ ] Standardize API responses and error handling.
- [ ] Validate request bodies, query parameters and uploaded files.
- [ ] Review CORS configuration and environment-based origins.
- [x] Replace in-memory visitor counting with a persistent aggregate counter; no visitor identifiers are stored.
- [ ] Define durable storage for uploaded images and resumes before production hosting.
- [ ] Add API tests for public and protected endpoints.

### Phase 4 — Frontend quality
- [ ] Test all public sections on desktop, tablet and mobile.
- [ ] Test contact form validation, submission, loading and error/success states.
- [ ] Test admin login, protected routes and all CRUD screens.
- [ ] Check empty states, loading states, broken images and API failure handling.
- [ ] Preserve existing design, theme, animations and intended interactions unless a documented issue requires a change.

### Phase 5 — SEO, accessibility and performance
- [ ] Verify title, description, canonical URL, Open Graph and structured data.
- [ ] Remove stale hosting-domain references and confirm the final canonical domain.
- [ ] Check keyboard navigation, labels, contrast and semantic structure.
- [ ] Optimize image sizes and loading behavior.
- [ ] Run Lighthouse or equivalent checks and record results.

### Phase 6 — Deployment (only after approval)
- [ ] Select compatible hosting for the React frontend and Express API.
- [ ] Confirm PostgreSQL hosting, migrations, secrets and backup policy.
- [ ] Configure persistent object/file storage for uploads.
- [ ] Configure HTTPS, CORS, environment variables and domain/DNS.
- [ ] Deploy staging first; run smoke and security checks.
- [ ] Deploy production only after user approval and successful staging verification.

## 5. Definition of done

A task is complete only when its code change is reviewed, relevant tests/checks pass, no secret or private data is exposed, documentation is updated, and the result is recorded in `WORK_LOG.md`. A feature is not considered complete merely because its page or route exists.

## 6. Immediate next step

Run the baseline commands in `docs/DEVELOPMENT_WORKFLOW.md`. Do not begin database migration changes or deployment until the baseline and database state are understood.
