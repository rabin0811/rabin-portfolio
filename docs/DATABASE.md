# Database Documentation

## Database technology

The reviewed Prisma schema declares PostgreSQL as its datasource and generates a Prisma Client. The backend package includes Prisma 7, `@prisma/adapter-pg` and `pg`.

## Models in `server/prisma/schema.prisma`

| Model | Purpose | Important fields |
|---|---|---|
| `Admin` | Administrator identity and profile | `id`, `email`, `password`, `googleId`, `name`, `profileImage`, reset-code fields |
| `Project` | Portfolio projects | `title`, `description`, `image`, `github`, `liveDemo`, `visible`, `createdAt` |
| `Blog` | Blog posts | `title`, `content`, `image`, `category`, `createdAt` |
| `Contact` | Visitor messages | `name`, `email`, `subject`, `message`, `isRead`, `createdAt` |
| `GalleryImage` | Gallery assets and ordering | `filename`, `filepath`, `mimetype`, `orderIndex`, `createdAt` |
| `Resume` | Resume records | `name`, `data`, `mimeType`, `isActive`, `adminId`, `createdAt` |
| `VisitorCounter` | Persistent aggregate visitor count | singleton `id`, `total`; no visitor identifiers |

`Resume.adminId` references `Admin.id`; an Admin can have multiple Resume records.

## Migration status observed

The existing `server/prisma/migrations/20260527130518_init/migration.sql` is only 3 bytes (a UTF-8 BOM), which PostgreSQL rejects as SQL. A follow-up schema migration and visitor-counter migration have been added. On the fresh local Docker database only, the no-op initial migration was marked applied and the follow-up migrations were deployed. The original migration file remains unchanged.

Do not run `prisma migrate deploy` against another fresh or existing database until its schema and migration history are verified. A fresh database will also need the no-op initial migration resolved before deployment; production history has not been inspected.

## Required database practices

- Keep production connection strings in environment variables/secrets, never source control.
- Use reviewed Prisma migrations for schema changes.
- Back up the database before production migrations.
- Avoid returning password hashes, reset codes or other internal fields from API responses.
- Add indexes based on measured query patterns, especially date sorting and frequently filtered fields.
- Define retention and deletion rules for contact messages and uploaded content.
- Test migrations against a disposable/staging database before production.

## Storage inconsistency to review

The Admin model contains resume-related string fields, while a separate `Resume` model stores resume data and metadata. The codebase also has local resume upload paths. Decide on one canonical resume-storage approach and document any migration needed to preserve existing files and records.
