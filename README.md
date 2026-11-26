# Rabin Humagain — Developer Portfolio

A full-stack personal portfolio application with a React/Vite public website, an administrative dashboard, an Express API, and PostgreSQL persistence through Prisma.

> Documentation reflects the repository snapshot reviewed on 25 November 2026. Verify configuration and implementation details against the current source before deploying.

## Project structure

```text
rabin-portfolio/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── admin/           # Admin pages, layout and components
│       ├── components/      # Public layout, sections and SEO
│       ├── context/         # Shared React context (theme)
│       └── assets/          # Frontend assets
├── server/                 # Express API
│   ├── controllers/         # Request/business logic
│   ├── middleware/          # Authentication and uploads
│   ├── models/              # Data access modules
│   ├── prisma/              # Prisma schema and migrations
│   ├── routes/              # API route definitions
│   └── uploads/             # Current local upload storage
└── docs/                   # Project documentation
```

## Technology stack

- Frontend: React 19, Vite 8, React Router, Axios, Tailwind CSS and related UI libraries.
- Backend: Node.js, Express 5, JWT authentication, bcryptjs and Nodemailer.
- Data: PostgreSQL with Prisma 7 and the PostgreSQL driver/adapter.
- Other integrations: Google authentication libraries and local file uploads.

## Main capabilities present in the codebase

- Public portfolio sections for introduction, about, skills, certifications, projects, blog, gallery and contact.
- Admin login and protected administration pages.
- Management routes for projects, blogs, gallery images, contact messages and resumes.
- Profile and content upload endpoints.
- SEO component and sitemap/robots assets.

## Local development

Use separate terminals. Install dependencies in each application directory.

### Frontend

```powershell
cd client
npm install
npm run dev
```

### Backend

```powershell
cd server
npm install
npm run dev
```

The backend source currently defaults to port `5000`; the Vite development server normally uses port `5173`. Configure environment variables according to `docs/ENVIRONMENT.md` and the actual source code. Do not commit `.env` files or secrets.

## Build and quality checks

```powershell
# Frontend
cd client
npm run lint
npm run build

# Backend
cd ..\server
npm run build
```

The backend build script runs `prisma generate`; it is not a complete automated test suite. Add and run tests before treating a release as production-ready.

## Documentation index

- [Project overview](docs/PROJECT_OVERVIEW.md)
- [Architecture](docs/ARCHITECTURE.md)
- [API reference](docs/API_REFERENCE.md)
- [Database](docs/DATABASE.md)
- [Environment configuration](docs/ENVIRONMENT.md)
- [Security review and requirements](docs/SECURITY.md)
- [Development roadmap](docs/ROADMAP.md)
- [Contribution and workflow](docs/CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)

## Important production note

The repository includes fixes for the reviewed upload, CORS, visitor-count, analytics-access and admin-profile findings. Before production, configure R2, SMTP and the initial administrator setup key, and verify database migration history for the target environment. See [Security](docs/SECURITY.md) and [Roadmap](docs/ROADMAP.md).
