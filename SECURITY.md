# Security baseline

## Current release

This release is a client-only product prototype. The demo authentication flow is intentionally non-authoritative: it stores a display profile in `localStorage` so the learning journey can be demonstrated without a backend. It must not be used for real identity, authorization, or sensitive learner data.

The current UI avoids collecting or transmitting real passwords, does not embed secrets, and keeps course content static. Remote imagery is loaded from Unsplash and should be replaced with approved organization-managed assets before production launch.

## Required before production

1. Add a server-owned authentication service with secure, httpOnly, same-site session cookies and password hashing handled by a trusted identity provider.
2. Move all progress, saved courses, profiles, and role assignments behind authenticated API endpoints. Never trust a client-provided role or progress value.
3. Enforce authorization on the server using explicit roles (`learner`, `mentor`, `content_editor`, `org_admin`) and least-privilege resource checks.
4. Add CSRF protection, input validation, rate limiting, audit logging, account recovery controls, and security headers including a strict Content Security Policy.
5. Minimize learner data, define retention/deletion rules, and document consent and data access procedures appropriate for minors and vulnerable users.
6. Add dependency scanning, secret scanning, lockfile review, automated tests for access control, and a pre-release security review.

## Reporting

Please do not report suspected vulnerabilities in public issues. Contact the repository maintainers privately with reproduction steps and impact details.
