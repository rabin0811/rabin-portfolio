# Project Work Log

This log records verified work. Update it as tasks are completed; do not mark an item done based only on the presence of a file or component.

## 2026-11-25 — Initial repository review and documentation planning

### Completed in this planning/review stage
- [x] Received and inspected the supplied `rabin-portfolio-review.zip` directory listing and selected frontend/backend source files.
- [x] Identified the project as a React/Vite frontend with an Express API and PostgreSQL/Prisma data layer.
- [x] Identified public portfolio sections and admin pages present in the snapshot.
- [x] Identified API route groups for auth, admin, analytics, blogs, contact, gallery, projects, uploads, visitors and resumes.
- [x] Prepared an initial Markdown documentation pack in a separate generated archive.
- [x] Added a master plan, restrictions, directory guide, development workflow and this work log to the documentation pack.

### Findings requiring investigation (not yet fixed)
- [x] Confirmed `/api/analytics` was public and returned full recent contact records; it now requires authentication and selects only dashboard-needed fields.
- [x] Confirmed the protected admin profile endpoint returned the full Admin record; it now selects only the name and email used by the Gallery page.
- [x] Confirmed the public project endpoint filters hidden entries; the unfiltered admin list was public. Protected `/api/projects` and updated its admin client request to send the bearer token.
- [x] Confirmed the initial migration SQL contains only a UTF-8 BOM (3 bytes); preserved the original file and resolved it only in the fresh local database after explicit approval.
- [x] Replaced the in-memory visitor counter with an atomic persistent aggregate and browser-tab-session tracking that stores no visitor identifiers.
- [x] CORS now reads production origins from `CORS_ORIGINS`, permits localhost only outside production, and defaults to the confirmed `https://humagainrabin.com.np` origin.
- [x] Added Cloudflare R2 as the production upload strategy; live migration still requires owner credentials and verification.
- [x] Updated canonical, Open Graph, schema, and sitemap URLs to the confirmed `https://humagainrabin.com.np` domain; SEO URL resolution now handles absolute and relative URLs correctly.
- [x] Improved contact form interaction and submission feedback; added server-side required-field, whitespace, and email validation.

### Not yet done at the initial review checkpoint
- [ ] No source-code fixes have been applied in this review stage.
- [ ] No local lint/build/test commands have been run by the owner and no baseline results have been recorded.
- [ ] No database migration has been run or modified.
- [ ] No deployment has been performed.

## 2026-11-25 — Frontend bundle and backend build baseline

- [x] Frontend lint baseline was reported as failing with 10 errors and 2 warnings across seven files; all findings have since been fixed and full ESLint passes.
- [x] Frontend production build passed. Its initial build reported a JavaScript chunk above Vite's 500 kB advisory threshold.
- [x] Updated `client/src/App.jsx` to lazy-load admin pages. The subsequent build passed without the chunk-size warning; the largest emitted chunk was 477.94 kB.
- [x] Ran the backend `npm ci` and `npm run build` in a temporary Docker container. Prisma Client v7.8.0 generated successfully.
- [x] Re-ran Prisma generation in a temporary container with OpenSSL installed; generation passed without the earlier OpenSSL detection warning.
- [x] Applied semver-compatible backend dependency fixes to `server/package-lock.json` with `npm audit fix --package-lock-only`; Prisma Client v7.10.1 generated successfully in Docker with no OpenSSL warning.
- [x] Upgraded Nodemailer to 10.6.1 and aligned `prisma`, `@prisma/client`, and `@prisma/adapter-pg` at 7.10.1.
- [x] Added an `effect` 3.22.1 npm override after an isolated Docker test confirmed Prisma generation succeeds with it.
- [x] In Docker, `npm ci`, `npm audit` (0 vulnerabilities), Prisma generation, and syntax checks for the auth and changed route files passed.
- [x] Syntax-checked both changed backend route files in Docker and ran `git diff --check`.
- [x] Fixed the frontend lint findings: empty catches now log failures, unused Gallery state was removed, and data-loading effects avoid synchronous effect updates and stale state writes.
- [x] Verified the frontend with `npm run lint` and `npm run build`; both pass and the build has no chunk-size warning.
- [x] Protected the unfiltered admin project listing and updated its frontend request to send the bearer token; public listing remains filtered to visible projects.
- [x] Made the contact form explicitly open by click/tap, added pending/success/error feedback without clearing failed submissions, and added API input validation; focused controller checks passed in Docker.
- [x] Made CORS origin configuration environment-specific and aligned the site canonical, Open Graph, schema, and sitemap URLs with the user's confirmed domain.
- [ ] Continue investigating the other backend and deployment findings listed above.
- [ ] No database migration or deployment was performed.

## 2026-11-25 — Cloudflare R2 upload storage

- [x] Added a storage adapter that keeps local disk uploads for non-production and requires complete Cloudflare R2 configuration in production.
- [x] Connected the upload middleware to R2, ensured local category directories are created, limited files to 10 MiB and rejected SVG uploads.
- [x] Added the private-bucket `/uploads/:category/:filename` proxy and R2-aware deletion for gallery and profile images; existing URL shapes remain unchanged.
- [x] Added `npm run uploads:sync-r2` to copy local files to matching R2 object keys without deleting the local originals; documented the required environment variables.
- [x] Verified in Docker: backend `npm ci`, `npm audit` (0 vulnerabilities), Prisma generation/build, JavaScript syntax checks, and mocked R2 upload/read/delete/path-validation checks passed.
- [ ] Live R2 upload/read/delete and migration remain unverified until the owner configures bucket credentials locally.
- [x] Added file-signature and extension validation for accepted image and PDF types with focused stream replay/mismatch tests.
- [ ] Database-dependent findings (visitor counter persistence and the migration baseline) remain outstanding.
- [ ] No secrets were added, no database migration was run, and no commit or deployment was performed.

## 2026-11-25 — Password reset token hardening

- [x] Replaced six-digit `Math.random()` reset codes with 256-bit random tokens; only SHA-256 digests are stored.
- [x] Added constant-time token comparison, expiry checks, and atomic one-time consumption; reset tokens are no longer logged.
- [x] Made unknown and Google-only accounts receive a generic response, and made SMTP configuration required before password-reset requests are processed.
- [x] Updated the admin reset form for the longer token and generic response.
- [x] Added a focused Node test for stored digests, invalid/expired token rejection, successful one-time reset, replay rejection, account-response consistency and missing SMTP configuration.
- [x] Backend test passed in Docker; frontend lint and production build passed.
- [ ] Configure SMTP before using the password-reset flow in deployment.

## 2026-11-25 — Authentication rate limits

- [x] Added per-IP limits: login/Google login 10 unsuccessful attempts per 15 minutes; forgot password 3 requests per hour; reset 10 unsuccessful attempts per 15 minutes; registration 5 requests per hour.
- [x] Added standard rate-limit response headers and optional `TRUST_PROXY_HOPS` configuration with positive-integer validation.
- [x] Added persistent tests for endpoint throttling and verified the backend test suite, Prisma generation, and `npm audit` (0 vulnerabilities).
- [ ] Limits use the package's in-memory store; configure a shared store before running multiple API instances and set proxy hops only after confirming the hosting topology.

## 2026-11-25 — Initial administrator bootstrap

- [x] Required a server-only, minimum-32-byte `ADMIN_SETUP_KEY` for the one-time local administrator registration.
- [x] Blocked Google login from creating the first administrator while preserving sign-in/linking for an existing account.
- [x] Added the setup-key field to the initial registration form and documented the environment variable without adding a secret.
- [x] Added tests covering wrong/missing setup keys, one-time registration, and blocked Google bootstrap.
- [ ] Configure a high-entropy setup key in the server environment before creating the first administrator.

## 2026-11-25 — Upload content validation

- [x] Added streaming signature and extension checks for PNG, JPEG, GIF, WebP and PDF files before local or R2 storage; the inspected prefix is replayed so file bytes are preserved.
- [x] Added safe upload error responses and focused tests for all accepted signatures, spoofed MIME content, filename-extension mismatch, SVG rejection, and the exact 10 MiB size boundary.
- [x] Backend tests, dependency audit, Prisma generation, frontend lint and production build passed.
- [ ] Live R2 upload/migration and deployment configuration remain unverified without owner credentials.

## 2026-11-25 — Safe API error responses

- [x] Added a shared server-error response helper that logs contextual errors and returns safe generic messages.
- [x] Replaced raw exception messages across API controllers/routes; sanitized resume Multer errors as well.
- [x] Added a test proving internal exception details are logged but not returned to clients.
- [x] Added an Express-level fallback handler for errors forwarded by middleware; unexpected details are logged but not sent to clients.

## 2026-11-25 — HTTP security headers

- [x] Added Helmet defaults and configured cross-origin resource policy for public portfolio uploads.
- [x] Added a test for nosniff, CSP, and cross-origin asset headers.
- [x] Backend tests, dependency audit (0 vulnerabilities), and Prisma generation passed.

## 2026-11-25 — Local PostgreSQL setup and read-only migration check

- [x] Started a persistent PostgreSQL 16 Docker container named `rabin-portfolio-postgres`, bound to `127.0.0.1:5433`, with a named data volume.
- [x] Verified the container is running and healthy; its local-only credentials are in ignored `server/.env`.
- [x] Initially ran `npx prisma migrate status` read-only; it reported `20260527130518_init` as pending.
- [x] After explicit approval, added `20261125164500_create_schema` as a follow-up migration generated from `prisma/schema.prisma`, preserving the existing migration file.
- [x] `migrate deploy` found the BOM-only migration invalid SQL. Resolved that no-op migration as applied in this fresh local database only, then successfully applied the follow-up schema migration.
- [x] Added the persistent `VisitorCounter` model and migration; local migration status is up to date, Prisma schema diff reports no difference, and all seven application tables exist.
- [x] Kept the tracked BOM-only initial migration unchanged, as the user confirmed. A fresh database still needs that no-op migration resolved before `migrate deploy`; no existing/production database history has been inspected.
- [ ] Do not apply these migrations to another database without verifying its schema and migration state.
- [x] Added public read and increment endpoints; the frontend posts once per tab session, and the authenticated dashboard reads the persistent total.
- [x] Backend tests (9 passed), Prisma validation/status/schema-diff, frontend lint and production build passed.
- [ ] Visitor totals begin at zero in the new local database; no historical counts were available to migrate.

## 2026-11-25 — Visitor persistence and API error fallback

- [x] Replaced the process-local visitor number and analytics placeholder with a singleton PostgreSQL counter.
- [x] `GET /api/visitors` reads without incrementing; `POST /api/visitors` atomically increments. The frontend submits once per tab session and stores no visitor identifiers.
- [x] Updated the authenticated dashboard and API/database/architecture documentation.
- [x] Added a generic Express error fallback for unexpected middleware errors, with server-side logging and safe client responses.
- [x] Backend suite passed (10 tests); Prisma Client generation passed; frontend lint and production build passed.
- [x] Started the API on a temporary local port and verified health plus a database-backed `GET /api/visitors` response of zero without incrementing the counter.
- [x] Exercised visitor GET/POST against PostgreSQL in a transaction and rolled the test back, confirming persistence behavior without changing the saved count.

## 2026-11-25 — R2 configuration readiness

- [x] Checked R2 variable presence without displaying values; all four required variables are currently unset in `server/.env`.
- [x] Counted local upload metadata only: two files (one resume and one blog asset), totaling 663,733 bytes; no filenames or contents were read.
- [x] Updated the environment guide with exact variable names and the non-destructive migration command.
- [ ] Live R2 upload/read/delete and file migration await the owner's local credentials.

## 2026-11-25 — SMTP configuration readiness

- [x] Checked SMTP variable presence without displaying values; `SMTP_HOST`, `SMTP_USER` and `SMTP_PASS` are unset. `SMTP_PORT` is optional and defaults to `587`.
- [x] Confirmed password-reset tests cover token handling and the safe `503` response when SMTP is unavailable.
- [x] Ran a temporary loopback-only SMTP inbox test: reset mail was accepted, the token remained a digest in the database, and the temporary test admin was removed.
- [x] Stopped and removed the temporary SMTP inbox container; no test email or SMTP credentials were sent externally or saved in `server/.env`.
- [ ] Real password-reset email delivery awaits the owner's SMTP provider configuration in `server/.env`.

## 2026-11-25 — Local initial-admin setup readiness

- [x] Generated 32-byte random `JWT_SECRET` and `ADMIN_SETUP_KEY` values in ignored `server/.env`; values were not displayed or logged.
- [x] Verified both values meet the 32-byte minimum and confirmed `server/.env` remains ignored by Git.
- [x] Confirmed the local database still contains zero administrator records; no account was created.
- [x] Backend suite passed (10 tests) with the local auth settings present.
- [ ] The owner must use the setup key from local `server/.env` when registering the first administrator.

## 2026-11-25 — Deployment proxy configuration check

- [x] Inspected repository deployment configuration; `client/vercel.json` configures only the frontend SPA rewrite.
- [x] Owner confirmed the API is deployed directly on Render and Cloudflare is used for R2 only.
- [x] Verified Render's web-service load balancer and Express's hop-count documentation; documented `TRUST_PROXY_HOPS=1` for the confirmed direct Render path, to be set in Render's environment.
- [ ] Recalculate proxy trust if Cloudflare is later placed in front of the API; do not set the local direct-connection `.env` value.

## 2026-11-25 — Local browser smoke test

- [x] Opened the local portfolio at `http://localhost:5173/`; the page rendered and same-origin API requests worked through the configured `localhost` CORS origin.
- [x] Confirmed public GitHub projects render. The local projects and blogs lists are empty, and resume info returned 404 because no local resume/admin existed at the time.
- [x] Submitted the contact form with synthetic test data; the API returned “Message sent successfully.”
- [x] Removed the single temporary contact record from the local database after verification.
- [x] The owner subsequently completed local admin registration.
- [ ] Real email delivery, R2 uploads and populated portfolio content still need configuration/data before they can be tested.

## 2026-11-25 — Gallery upload troubleshooting

- [x] Confirmed the local database has an admin account but no gallery records.
- [x] Fixed a crop/upload mismatch: the cropper exports JPEG bytes, so the multipart filename now uses a `.jpg` extension that matches the content validator.
- [x] Frontend lint and production build passed.
- [x] Later confirmed two local gallery records exist; the newest one loads in the admin logo. No image contents or filenames were inspected.

## 2026-11-25 — Admin session and dashboard photo

- [x] Changed admin authentication storage from persistent local storage to tab-scoped session storage; legacy persistent tokens are cleared.
- [x] Admin session is cleared when navigation or browser Back leaves the admin area; successful login replaces the login history entry.
- [x] Added the newest Gallery upload, selected by creation time, as the admin sidebar RH image; RH initials remain as a fallback.
- [x] Verified the browser Back transition clears the session token and the dashboard logo matches and loads the latest of two local gallery images.
- [x] Frontend lint/build and `git diff --check` passed.

## 2026-11-25 — Local admin sign-in CORS

- [x] Diagnosed the repeated sign-in network error: the running Vite frontend used port 5174, which was not in the API's fixed local-origin list.
- [x] Updated development CORS to allow HTTP origins on `localhost` and `127.0.0.1` at any port; production continues to use only configured origins.
- [x] Verified the admin page and browser API request at `http://127.0.0.1:5174` succeed; sign-in preflight is allowed and an unrelated origin is not.

## 2026-11-25 — Local admin project CRUD smoke test

- [x] Created a clearly labeled temporary project through the authenticated admin UI with no image or external links.
- [x] Confirmed it appeared in the project list, deleted it through the admin UI, and verified zero matching rows remain in PostgreSQL.
- [x] Cleared the temporary title/description from the form afterward.

## Update template

### YYYY-MM-DD — Short task name
- [ ] What changed:
- [ ] Files changed:
- [ ] Checks/tests run:
- [ ] Result:
- [ ] Follow-up tasks:
