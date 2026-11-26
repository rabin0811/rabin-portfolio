# Environment Configuration

Keep backend secrets in the ignored `server/.env` file locally and in the hosting provider's secret store in production. Never put secrets in Vite variables or commit them.

## Backend (`server/.env`)

| Variable | Purpose | Requirement |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection used by Prisma | Required |
| `JWT_SECRET` | Signs and verifies administrator tokens | Required for authentication; use a high-entropy secret |
| `PORT` | Express listening port | Optional; defaults to `5000` |
| `CORS_ORIGINS` | Comma-separated allowed frontend origins | Optional; defaults to `https://humagainrabin.com.np`; local Vite origins are added outside production |
| `TRUST_PROXY_HOPS` | Number of trusted reverse-proxy hops for client IP handling | For the confirmed direct Render Web Service setup (Cloudflare R2 only), set to `1` in Render's environment; recalculate if another proxy is added |
| `ADMIN_SETUP_KEY` | One-time key for creating the first administrator | Required for the initial registration; keep server-side and use at least 32 random bytes |
| `GOOGLE_CLIENT_ID` | Enables Google sign-in | Optional if Google sign-in is unused |
| `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` | Sends administrator password-reset email | Required to use password reset |
| `SMTP_PORT` | SMTP server port | Optional; defaults to `587` |

### Cloudflare R2

| Variable | Purpose |
|---|---|
| `R2_ACCOUNT_ID` | Cloudflare account identifier |
| `R2_BUCKET_NAME` | Private R2 bucket name |
| `R2_ACCESS_KEY_ID` | R2 S3-compatible access key |
| `R2_SECRET_ACCESS_KEY` | R2 S3-compatible secret |

All four R2 variables must be set together. Production startup fails if they are missing or incomplete. Outside production, leaving all four unset keeps uploads on local disk.

After configuring R2, copy existing files with `npm run uploads:sync-r2` from `server/`. The command copies files to R2 and preserves local originals. Verify the objects and public `/uploads/...` proxy before switching production traffic.

## Frontend (`client/.env.local`)

| Variable | Purpose | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000` |
| `VITE_SITE_URL` | Canonical public site URL | `https://humagainrabin.com.np` |

Vite embeds `VITE_` variables in browser code. They are public; never put credentials or private keys in them.

## Deployment topology

The repository's Vercel configuration covers the client-side SPA rewrite only; no backend hosting or reverse-proxy configuration is present. Do not infer the API's `TRUST_PROXY_HOPS` value from the frontend's Vercel configuration.

The owner confirmed that the API is deployed directly on Render and Cloudflare is used for R2, not as an API proxy. For that setup, configure `TRUST_PROXY_HOPS=1` in the Render service environment: [Render terminates TLS at its load balancer and forwards requests to the web service](https://render.com/docs/web-services), and Express's numeric trust setting specifies the number of hops from the app ([Express proxy guidance](https://expressjs.com/en/guide/behind-proxies/)). If Cloudflare proxying is later added in front of the API, reassess this value before enabling it.

## Rules

1. Use separate credentials for local, staging and production.
2. Keep `.env`, `.env.local`, production secrets, private keys and database dumps out of Git.
3. Configure production variables in the hosting provider's secret/environment settings.
4. Do not guess `TRUST_PROXY_HOPS`; an incorrect value can break client-IP attribution and rate limits.
5. Verify the target database's schema and migration history before running production migrations.
