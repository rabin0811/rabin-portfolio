# Project Overview

## Purpose

This project is a personal developer portfolio for presenting professional information, technical skills, certifications, selected projects, writing, gallery content and contact details. It also includes an administrative interface for managing portfolio content.

## Users and roles

- **Public visitor:** views published portfolio content, downloads the available resume and submits a contact message.
- **Administrator:** authenticates and manages portfolio content through protected API operations and admin pages.

The source snapshot does not define a general multi-role permission system. Treat the administrator as the single privileged role unless the application is deliberately extended.

## Functional areas

| Area | Current implementation |
|---|---|
| Public portfolio | React sections and layout components |
| Theme | React theme context |
| SEO | Shared SEO component, robots and sitemap assets |
| Admin interface | Login, dashboard, messages, projects, blogs, gallery and resumes pages |
| Authentication | Local and Google login-related routes; JWT protection middleware |
| Projects | Public listing and protected create/update-visibility/delete operations |
| Blogs | Public listing and protected create/delete operations |
| Contact | Public message submission; protected message retrieval and management |
| Gallery | Public image listing; protected upload, delete and reorder operations |
| Resume | Public information/download; protected list, upload, activation and deletion |
| Analytics | Counts and recent messages endpoint |
| Visitor counter | In-memory counter endpoint |

## Non-goals for the current phase

- Replacing the application with a new framework.
- Redesigning the visual identity without an agreed design change.
- Moving production traffic before security, storage and deployment checks are complete.

## Current development principle

Preserve existing visual design and user-facing functionality where practical. Make changes incrementally, review diffs, run checks, and verify affected workflows before merging or deploying.
