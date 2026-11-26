# Development Workflow and Contribution Guide

## Principles

- Preserve existing design and functionality unless a change is agreed.
- Prefer small, focused changes over broad rewrites.
- Do not commit secrets, generated build output, dependency folders or local uploads containing private data.
- Keep API documentation, environment documentation and changelog current.

## Branching

Use descriptive branches, for example:

- `fix/analytics-auth`
- `fix/admin-profile-data-leak`
- `feat/persistent-upload-storage`
- `docs/project-documentation`

## Before changing code

1. Confirm the working tree is clean (`git status`).
2. Create a branch or a recoverable local backup.
3. Identify the affected route, controller, component and data model.
4. Write down expected behavior and relevant security implications.

## After changing code

1. Review the complete diff (`git diff`).
2. Run frontend lint/build when client code changes.
3. Run Prisma generation and relevant backend checks when server/database code changes.
4. Test both authorized and unauthorized behavior for protected endpoints.
5. Test the affected user workflow in the browser.
6. Update documentation and `CHANGELOG.md`.

## Commit message examples

- `fix: protect analytics endpoint`
- `fix: filter sensitive admin profile fields`
- `refactor: centralize API error handling`
- `docs: add architecture and security documentation`

## Pull request checklist

- [ ] Scope is focused and explained.
- [ ] No secrets or private user data are included.
- [ ] Tests/build checks pass, or failures are documented.
- [ ] Authorization and validation are covered where relevant.
- [ ] Documentation is updated.
- [ ] No unrelated formatting or generated-file changes are included.
