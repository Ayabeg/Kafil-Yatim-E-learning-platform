# Security baseline

## Current release

This release includes a local Node API with Better Auth, SQLite-backed sessions, server-side learner progress, saved courses, and role checks. The frontend does not treat `localStorage` as identity or authorization. The default development secret is intentionally rejected when `NODE_ENV=production`.

The API uses httpOnly, same-site session cookies, password length bounds, database-backed rate limiting, strict role allowlists, request body limits, parameterized SQL, and baseline security headers. Remote imagery is loaded from Unsplash and should be replaced with approved organization-managed assets before production launch.

## Required before production

1. Move the SQLite store to managed Postgres before horizontal scaling or production learner data.
2. Add CSRF protection appropriate to the final deployment topology, account recovery controls, email verification, and MFA/passkey support.
3. Add audit logging for role changes, content edits, exports, and administrative access.
4. Minimize learner data, define retention/deletion rules, and document consent and data access procedures appropriate for minors and vulnerable users.
5. Add dependency scanning, secret scanning, lockfile review, and a pre-release security review.

## Reporting

Please do not report suspected vulnerabilities in public issues. Contact the repository maintainers privately with reproduction steps and impact details.
