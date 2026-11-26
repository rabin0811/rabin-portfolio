# Project Restrictions and Development Rules

These rules govern all work in this repository unless the owner explicitly changes them.

## 1. Scope and change control

1. Improve the existing application; do not replace it with a new template or rewrite the stack without a documented reason and owner approval.
2. Work in small, reviewable steps. Prefer one logical fix per change.
3. Do not remove existing sections, admin features, animations, theme behavior or content-management functions without approval.
4. Before editing a file, inspect its callers, API contract and related styles/components.
5. Do not claim a feature is working until it has been tested.
6. Deployment is out of scope until the owner explicitly moves the project into the deployment phase.

## 2. Technology restrictions

- Keep the current React/Vite frontend and Express backend unless a technical decision is documented and approved.
- Keep PostgreSQL/Prisma as the current data layer unless a migration decision is approved.
- Avoid adding dependencies for tasks that can be solved safely with existing packages.
- Keep frontend and backend responsibilities separate; never put database credentials or server secrets in frontend code.

## 3. Security and privacy rules

- Never commit `.env` files, API keys, database URLs, JWT secrets, OAuth secrets, SMTP credentials, passwords or private certificates.
- Never paste secrets into chat, issue trackers or Markdown documentation. Use placeholder names in examples.
- Never return password hashes, reset codes, reset tokens or other authentication internals from API responses.
- Private contact messages and admin analytics must be protected by authentication and authorization.
- Validate and sanitize all untrusted input on the server.
- Treat uploaded files as untrusted. Enforce size/type limits and safe storage/file naming; do not trust a browser-provided MIME type alone.
- Do not expose local filesystem paths or server stack traces to public API clients.
- Use HTTPS in production and explicit, environment-specific CORS origins.
- Do not run destructive database commands against a real database.

## 4. Database and migration rules

- Never run `prisma migrate reset`, destructive SQL, or schema push against production.
- Do not create or apply migrations until the actual database schema and migration history have been inspected and backed up.
- Test migrations against a disposable development database first.
- Preserve existing user/content data unless the owner explicitly authorizes a data migration or deletion.

## 5. Git and delivery rules

- Check `git status` before starting and before committing.
- Do not overwrite or discard user changes.
- Do not force-push, delete branches, rewrite history or commit directly to a protected/main branch without approval.
- Keep commits focused and descriptive.
- Update documentation and `WORK_LOG.md` after each completed phase/task.

## 6. Design and content rules

- Preserve the existing visual identity and responsive behavior.
- Do not invent qualifications, employment history, project outcomes, client names, testimonials or contact details.
- Ask the owner when personal or portfolio content is missing or ambiguous.
- Keep accessibility and mobile usability in scope for UI changes.

## 7. Deployment rules

- Do not assume the Express server can be deployed as a static Pages site.
- Do not move uploads to ephemeral local storage in a serverless environment.
- Do not publish until frontend, backend, database, storage, authentication, CORS, secrets and domain configuration are verified.
