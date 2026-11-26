# Development Roadmap

The objective is to improve the existing application without unnecessarily changing its visual identity or removing features.

## Phase 0 — Baseline and safety

- [ ] Keep an untouched backup of the supplied project.
- [ ] Confirm the local branch and working tree are clean.
- [ ] Record current frontend/backend versions and environment variable names.
- [ ] Install dependencies and capture existing build/lint results.
- [ ] Verify all current public and admin workflows locally.

**Exit criteria:** A reproducible baseline and a list of existing failures.

## Phase 1 — Security first

- [ ] Protect analytics and remove private message data from aggregate analytics.
- [ ] Restrict Admin profile response to safe fields.
- [ ] Enforce visibility filtering for public projects; protect admin listing.
- [x] Require a server-only setup key for initial admin registration and block Google-admin bootstrap.
- [x] Harden password reset token storage, expiry and one-time use.
- [x] Add per-IP rate limits to login, registration and password-reset endpoints.
- [ ] Extend rate limits to other abuse-sensitive endpoints and use a shared store for multi-instance deployments.
- [ ] Complete server-side input validation.
- [x] Apply upload size limits, safe filenames, MIME/signature/extension checks, and reject SVG uploads.
- [x] Return safe 400/413 responses for rejected upload types and size limits; retain storage cleanup behavior.
- [ ] Add authorization tests.

**Exit criteria:** Sensitive endpoints require authorization and tests prove unauthorized access is denied.

## Phase 2 — Database reliability

- [ ] Review current database and Prisma configuration.
- [ ] Establish a valid migration baseline without losing existing data.
- [x] Persist the aggregate visitor count without storing visitor identifiers.
- [ ] Consolidate Prisma client creation and data access patterns.
- [ ] Choose one resume storage strategy.
- [ ] Add indexes and constraints where justified.
- [ ] Test backup and restore procedures.

**Exit criteria:** A fresh database can be built from migrations and existing data can be migrated safely.

## Phase 3 — File storage and backend quality

- [x] Define an upload storage abstraction.
- [x] Move production uploads to durable object storage (Cloudflare R2 integration; migrate existing files before traffic).
- [ ] Add centralized validation and error handling.
- [ ] Standardize API response formats and status codes.
- [ ] Add API tests for public and protected routes.

**Exit criteria:** Uploads persist across server restarts/redeployments and API behavior is tested.

## Phase 4 — Frontend quality

- [ ] Review API client and environment-based API URL.
- [ ] Add consistent loading, empty and error states.
- [ ] Fix contact-form response handling and preserve user input on failure.
- [ ] Replace hover-only interactions with touch/keyboard-accessible controls.
- [ ] Lazy-load suitable routes and heavy admin/chart components.
- [ ] Review responsive layout, accessibility and image sizing.

**Exit criteria:** Core flows work on mobile, keyboard and desktop with clear feedback.

## Phase 5 — SEO, performance and maintainability

- [ ] Fix canonical URL construction and remove stale deployment-domain references.
- [ ] Validate metadata, sitemap and robots directives.
- [ ] Audit bundle size and optimize images.
- [ ] Remove unused assets/dependencies only after confirming they are unused.
- [ ] Add formatting/lint conventions and useful tests.

**Exit criteria:** SEO metadata is correct and build output/performance are measured.

## Phase 6 — Deployment readiness

- [ ] Select hosting for the frontend, Node.js API, PostgreSQL and object storage.
- [ ] Configure production environment variables and CORS.
- [ ] Run migrations using a reviewed release process.
- [ ] Configure HTTPS, domain, health checks and backups.
- [ ] Run smoke tests and verify rollback procedure.

**Exit criteria:** Production deployment is repeatable, monitored and recoverable.

## Working rule

Work on one small change at a time. Review the diff, run the relevant tests/build, manually verify the affected workflow, and commit only when the change is understood and stable.
