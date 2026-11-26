# Security Review and Requirements

This is a code-review checklist based on the repository snapshot supplied for review (25 November 2026). Findings should be rechecked after fixes; this file is not a penetration-test report.

## Findings requiring remediation

### Critical — analytics data exposure

`server/routes/analyticsRoutes.js` defines `GET /` without the authentication middleware and returns recent contact records. Contact records contain personal information and message content.

**Required fix:** Require administrator authentication; return only aggregate metrics by default; avoid including message bodies and email addresses in dashboard analytics unless strictly necessary.

### High — administrator profile response

`server/routes/adminRoutes.js` fetches the Admin record and serializes the full record. The schema includes password, Google ID and password-reset fields.

**Required fix:** Select and return an explicit allowlist of safe fields. Never return password hashes, reset codes, reset-code expiry or internal authentication identifiers.

### High — project visibility boundary

`GET /api/projects` is unprotected and calls `fetchProjects`, while a separate `/public` route exists for public projects. Review the controller to ensure hidden projects cannot be retrieved through the general endpoint.

**Required fix:** Make the public route return only `visible: true`; protect administrative listing routes.

### High — password reset and authentication abuse
Password reset tokens are now generated with 256 bits of randomness, stored as SHA-256 digests, expire after 15 minutes and are consumed atomically. Nonexistent and Google-only accounts receive the same response, and reset tokens are no longer logged. SMTP must be configured before reset requests are processed.

**Remaining work:** Use a shared limiter store for multi-instance deployments, review SMTP failure responses and consider a stronger password policy. Existing reset tokens issued before this change are invalid; request a fresh token after deployment.

### Initial administrator bootstrap
Public local registration requires a server-only `ADMIN_SETUP_KEY` of at least 32 bytes and compares it in constant time. Registration remains closed after an administrator exists. Google sign-in can link to an existing administrator but cannot create the first account.

Provide the setup key only to the intended administrator during initial setup. Do not put it in frontend environment variables or source control. Registration is unavailable until the key is configured.

### Authentication rate limits
Login and Google login are limited to 10 unsuccessful attempts per 15 minutes per IP; password reset requests to 3 per hour; password reset attempts to 10 unsuccessful attempts per 15 minutes; and registration attempts to 5 per hour. Responses include standard rate-limit headers.

The default limiter store is in-memory and therefore applies per server process. Use a shared store before scaling to multiple instances. If the API is behind a reverse proxy, set `TRUST_PROXY_HOPS` to the verified number of trusted hops; do not guess this value, as it affects client-IP attribution.

The public visitor-count endpoint allows one increment per IP address per hour using the same in-memory limiter. This reduces repeated counter inflation, but can undercount visitors sharing an IP and resets when the API process restarts. The frontend's per-tab check is only a usability optimization, not a security boundary.

### High — upload validation and persistence
Uploads use server-generated filenames, a 10 MiB size limit, MIME-type allowlists and signature/extension matching for PNG, JPEG, GIF, WebP and PDF; SVG uploads are rejected. Local storage remains available outside production, while production requires Cloudflare R2 credentials and streams files through the API.

**Remaining work:** Configure a private R2 bucket and migrate existing local files with `npm run uploads:sync-r2` before production traffic. The migration command intentionally leaves the local originals in place.

### High — production configuration
The API uses `CORS_ORIGINS` and requires R2 configuration in production. Local disk storage may not persist on serverless/ephemeral hosts.

**Remaining work:** Verify the deployment's exact CORS origins and R2 credentials, and configure secure proxy/cookie behavior as applicable.

## Additional controls

- API handlers now log server exceptions through a shared helper and return generic client messages rather than raw exception details. Add an Express-level fallback handler if new routes begin forwarding uncaught errors.
- Validate and normalize all incoming request data on the server.
- Apply request-size limits and extend rate limiting to other abuse-sensitive endpoints.
- Helmet now sets security headers; public upload responses explicitly allow cross-origin embedding for the portfolio frontend. Continue reviewing headers when adding new browser-facing routes.
- Use HTTPS in production.
- Apply least privilege to database credentials.
- Keep authentication secrets out of frontend code and logs.
- Add authorization tests for every admin route and ID-based operation (including ownership checks where relevant).
- Log security-relevant events without logging passwords, tokens, reset codes or private message contents.

## Release gate

Do not deploy publicly until the critical analytics exposure and sensitive admin profile response are fixed and verified with automated tests.
