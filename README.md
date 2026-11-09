# Kafil Academy

Kafil Academy is the first learner-facing release of the Kafil El Yatim self-development learning platform. It is a responsive React/Vite experience for discovering guided learning paths, creating a learner profile, tracking progress, and completing lessons.

## Run locally

```bash
npm install
npm run db:migrate
npm run api
```

In a second terminal, run the Vite client:

```bash
npm run dev
```

The client proxies `/api` to `http://localhost:4000`. The API uses Node 22's built-in SQLite runtime and Better Auth for server-owned sessions. Set `BETTER_AUTH_SECRET`, `APP_ORIGIN`, and a durable `KAFIL_DATABASE_PATH` before deploying.

## Current product surface

- Public landing page aligned with Kafil El Yatim's warm, optimistic visual language.
- Real email/password sign-up and login through Better Auth with httpOnly session cookies.
- Learner dashboard with active course progress, weekly learning activity, streak, and discovery recommendations.
- Course catalog with search, category filtering, save-for-later actions, and course detail pages.
- Lesson experience with a course outline, server-persisted progress, completion state, and next-lesson flow.
- Profile area with badges, stats, and saved course count.
- API health, course, learner, mentor, and admin endpoints with server-side role checks.
- Repeatable API smoke test covering signup, session retrieval, progress persistence, and learner/admin isolation.

The current SQLite store is a portable local/single-instance foundation. Production should move the same schema to a managed Postgres provider before horizontal scaling or storing sensitive learner data.
