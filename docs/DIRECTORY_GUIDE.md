# Directory and File Guide

This guide describes the structure visible in the supplied project snapshot. It is not a promise that every listed feature is fully operational.

## Repository root

- `client/` — React/Vite frontend.
- `server/` — Express API, Prisma data layer, authentication, uploads and backend logic.
- Root Markdown files — project purpose, rules, architecture, API/database/environment notes, roadmap and work history.

## `client/`

- `package.json`, `package-lock.json` — frontend dependencies and scripts.
- `index.html` — HTML entry document and metadata shell.
- `vite.config.js` — Vite configuration.
- `tailwind.config.js`, `postcss.config.js` — styling build configuration.
- `eslint.config.js` — lint configuration.
- `vercel.json` — existing Vercel-specific configuration; review before changing hosting.
- `src/main.jsx` — React bootstrap.
- `src/App.jsx`, `src/App.css` — main application composition and application-level styles.
- `src/index.css` — global styles.
- `src/context/ThemeContext.jsx` — theme state/context.
- `src/components/layout/` — shared public layout components such as navigation.
- `src/components/sections/` — public portfolio sections (Hero, About, Skills, Certifications, Projects, Blog, Contact, Footer and slideshow).
- `src/components/SEO.jsx` — SEO metadata component.
- `src/admin/` — admin interface.
- `src/admin/pages/` — admin screens for login, registration, dashboard, messages, projects, blogs, gallery and resumes.
- `src/admin/layout/` — admin page layout.
- `src/admin/components/` — shared admin components such as protected route and sidebar.
- `src/assets/` — frontend assets; remove unused template assets only after checking references.

## `server/`

- `server.js` — Express application setup, middleware, route mounting and server startup.
- `package.json`, `package-lock.json` — backend dependencies and scripts.
- `prisma/schema.prisma` — database model definitions.
- `prisma/migrations/` — Prisma migration history. The supplied initial migration SQL is only 3 bytes and must be investigated before migration work.
- `prisma.config.ts`, `prismaClient.js`, `prisma/client.js` — Prisma configuration/client support files; inspect before modifying.
- `routes/` — API route definitions and access middleware.
- `controllers/` — request handling and business logic.
- `models/` — database model/helper functions used by controllers.
- `middleware/` — authentication and upload processing middleware.
- `db.js` — database connection helper; verify whether it is still used.
- `seed.js` — development/initial data seeding; inspect before running.
- `uploads/` — local uploaded files (including sample resume/blog image in snapshot). Treat these as user content and do not delete casually.
- `.gitignore` — backend ignore rules.

## API route groups found

| Route group | Purpose inferred from route/controller names |
|---|---|
| `/api/auth` | Login, registration, Google login, verification and password reset |
| `/api/admin` | Admin profile |
| `/api/analytics` | Portfolio/admin statistics |
| `/api/blogs` | Blog listing and management |
| `/api/contact` | Contact form and message management |
| `/api/gallery` | Gallery listing and management |
| `/api/projects` | Project listing and management |
| `/api/upload` | Image/profile/resume upload operations |
| `/api/visitors` | Visitor counter |
| `/api/resume` | Resume information, download and management |

Confirm exact request/response schemas in the corresponding route and controller before changing or integrating an endpoint.
