# Architecture

## High-level design

```text
Browser
  |
  v
React 19 + Vite application (client/)
  |
  | HTTP requests (Axios)
  v
Express 5 API (server/)
  |-- Routes: URL mapping and middleware
  |-- Controllers: request handling and application logic
  |-- Middleware: JWT authentication and multipart uploads
  |
  v
Prisma Client
  |
  v
PostgreSQL

In development, Express serves local files from `server/uploads/` using `/uploads`.
In production, uploads use a private Cloudflare R2 bucket and Express streams objects
through the same `/uploads/:category/:filename` URLs.
```

## Frontend organization

- `client/src/App.jsx`: application composition and routing.
- `client/src/components/`: shared public components, SEO and portfolio sections.
- `client/src/admin/`: administration pages, layout, sidebar and protected-route component.
- `client/src/context/`: shared theme state.
- `client/src/assets/` and `client/public/`: static assets.

## Backend organization

- `server/server.js`: Express setup, CORS, JSON parsing, static uploads, health endpoint and route mounting.
- `server/routes/`: API endpoint definitions.
- `server/controllers/`: logic for authentication, blogs, contact messages, gallery, projects and resumes.
- `server/middleware/`: authentication and upload handling.
- `server/prisma/schema.prisma`: PostgreSQL data model.
- `server/models/`, `server/db.js`, `server/prismaClient.js`: data-access/client-related modules; review and consolidate these if they overlap.
- `server/storage.js`: local/R2 upload storage operations and safe object-key validation.

## Upload storage

Local disk storage is used when running outside production without R2 credentials.
Production startup requires `R2_ACCOUNT_ID`, `R2_BUCKET_NAME`, `R2_ACCESS_KEY_ID`
and `R2_SECRET_ACCESS_KEY` in `server/.env` (or the deployment environment). Keep
the bucket private; the API proxies public upload reads through `/uploads`.

To copy existing local uploads, configure those variables and run
`npm run uploads:sync-r2` from `server/`. The command does not delete local files.
Verify the migrated files before switching production traffic.

## API mount points

The server mounts routers under `/api/contact`, `/api/auth`, `/api/blogs`, `/api/projects`, `/api/upload`, `/api/analytics`, `/api/visitors`, `/api/admin`, `/api/gallery` and `/api/resume`. See [API Reference](API_REFERENCE.md).

## Architectural concerns to resolve

1. Use a single, documented Prisma client/data-access pattern.
2. Add centralized error handling and consistent response formats.
3. Separate public and administrator data at the API boundary.
4. Verify the R2 upload migration and production credentials before deployment.
5. Replace hardcoded CORS origins and localhost API defaults with environment configuration.
6. Visitor counts now use a persistent database counter; the frontend records at most once per tab session without storing visitor identifiers.
7. Add automated tests for authentication and every protected resource.
