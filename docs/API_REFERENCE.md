# API Reference

Base URL during local development: `http://localhost:5000`. The API routes below are derived from the Express router mounts and route definitions in the reviewed snapshot. Confirm request bodies and response schemas in the corresponding controller before integrating a client.

## Health

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/api/health` | Public | Basic health response |

## Authentication — `/api/auth`

| Method | Path | Access |
|---|---|---|
| POST | `/google-login` | Public |
| POST | `/register` | Public; one-time setup key required |
| POST | `/login` | Public; rate-limited |
| POST | `/forgot-password` | Public; rate-limited and requires SMTP configuration |
| POST | `/reset-password` | Public; rate-limited, expiring single-use token required |
| GET | `/verify` | Authenticated |
| GET | `/google-config` | Public configuration endpoint |
| GET | `/check-admin` | Public |
| GET | `/public-profile` | Public |

## Projects — `/api/projects`

| Method | Path | Access |
|---|---|---|
| GET | `/` | Authenticated admin listing |
| GET | `/public` | Public projects listing |
| POST | `/add` | Authenticated |
| PUT | `/:id/toggle` | Authenticated |
| DELETE | `/:id` | Authenticated |

## Blogs — `/api/blogs`

| Method | Path | Access |
|---|---|---|
| GET | `/` | Public |
| POST | `/add` | Authenticated |
| DELETE | `/:id` | Authenticated |

## Contact — `/api/contact`

| Method | Path | Access |
|---|---|---|
| POST | `/` | Public message submission |
| GET | `/` | Authenticated |
| DELETE | `/:id` | Authenticated |
| PUT | `/:id/read` | Authenticated |

## Gallery — `/api/gallery`

| Method | Path | Access |
|---|---|---|
| GET | `/` | Public |
| POST | `/upload` | Authenticated; multipart field `galleryImage` |
| DELETE | `/:id` | Authenticated |
| PUT | `/reorder` | Authenticated |

## Resumes — `/api/resume`

| Method | Path | Access |
|---|---|---|
| GET | `/info` | Public |
| GET | `/download` | Public |
| GET | `/list` | Authenticated |
| POST | `/upload` | Authenticated |
| PUT | `/:id/active` | Authenticated |
| DELETE | `/:id` | Authenticated |

## Administration and analytics

| Method | Path | Access | Notes |
|---|---|---|---|
| GET | `/api/admin/profile` | Authenticated | Returns only the administrator's name and email. |
| GET | `/api/analytics` | Authenticated | Returns aggregate counts and up to five recent contact messages for the dashboard. |
| GET | `/api/visitors` | Public | Returns the persisted count as `{ "visitors": number }`; does not increment it. |
| POST | `/api/visitors` | Public | Atomically increments the persisted aggregate and returns the new count. The frontend submits once per tab session; direct API calls are not deduplicated. |

## Uploads — `/api/upload`

The router includes authenticated upload operations for resume, project image, blog image and profile image, plus profile-image removal. Refer to `server/routes/uploadRoutes.js` for exact subpaths, multipart field names and response structures.

## Authentication convention

Protected routes use `server/middleware/authMiddleware.js`. Inspect that middleware and the frontend Axios configuration to confirm the exact token transport/header convention. Do not assume a request format that has not been verified.

## API documentation maintenance

When changing a route, update this document and add or update an automated request/authorization test. Document request fields, validation constraints, status codes and response examples from the implemented controller.
