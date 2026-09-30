# Production deployment checklist

## Required before deploy

1. Use Node.js 22 LTS and run `npm ci && npm run check && npm run build`.
2. Generate independent random values for `AUTH_SECRET` and `EMAIL_CODE_SECRET`.
3. Set the canonical HTTPS origin in `APP_URL` and `AUTH_URL`.
4. Configure Upstash Redis. The in-memory limiter is only a single-instance fallback.
5. Keep the SQLite database on a persistent encrypted volume and back it up automatically.
6. Run Prisma migrations before switching application traffic.
7. Configure SMTP, Cloudinary and DeepL credentials in the deployment secret store.
8. Create the first admin manually; never expose role assignment in a public route.
9. Put the app behind a trusted reverse proxy and overwrite, rather than append, forwarded headers.
10. Enable branch protection and require the CI workflow before merging to `master`.

## Operational checks

- Test registration, login, password reset and verification-code expiry.
- Test two simultaneous booking requests for the same slot.
- Confirm `/api/admin/*` returns 401 when signed out and 403 for a regular user.
- Verify upload type/size rejection and Cloudinary deletion.
- Add uptime monitoring, centralized logs, error tracking and an off-site database backup alert.
- Run a restore drill before accepting real customer bookings.

## SQLite scaling note

SQLite is suitable for one application instance. Before horizontal scaling, move booking and identity data to PostgreSQL and enforce an active-slot uniqueness constraint at database level.
