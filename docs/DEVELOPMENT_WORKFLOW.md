# Development Workflow and Baseline Checks

Run commands from PowerShell on Windows. The expected local project directory is `D:\\deploy\\rabin-portfolio`.

## 1. Protect the current work

```powershell
cd D:\deploy\rabin-portfolio
git status --short
git branch --show-current
git log -1 --oneline
```

If `git status` shows user changes, do not reset, clean, stash or overwrite them. Record what is present before proceeding.

## 2. Frontend baseline

```powershell
cd D:\deploy\rabin-portfolio\client
npm install
npm run lint
npm run build
```

Use `npm ci` instead of `npm install` when you want a clean lockfile-based install and the lockfile is valid. Do not delete the lockfile to silence installation errors.

## 3. Backend baseline

```powershell
cd D:\deploy\rabin-portfolio\server
npm install
npm run build
```

The backend `build` script in the reviewed package snapshot runs Prisma generation. It is not necessarily a full compile or test suite. Inspect available scripts with:

```powershell
npm run
```

## 4. Environment and database safety

- Check whether required environment variables are documented, but never print secret values into chat or commit them.
- Do not run Prisma migrations, `db push`, seed scripts or reset commands until the database target and migration state are confirmed.
- The reviewed migration file appears effectively empty (3 bytes); this is a stop-and-investigate item, not permission to reset the database.

## 5. How to report results

For each command, record:
- Command executed.
- Pass/fail result.
- Exact error text with secrets and personal data removed.
- Whether the issue existed before our changes.

## 6. Change cycle

1. Reproduce and understand one issue.
2. Identify affected files and expected behavior.
3. Make the smallest safe change.
4. Run relevant lint/build/tests.
5. Manually test the feature and regression paths.
6. Update relevant docs and `WORK_LOG.md`.
7. Review the diff before committing.
