# Kafil Academy

Kafil Academy is the first learner-facing release of the Kafil El Yatim self-development learning platform. It is a responsive React/Vite experience for discovering guided learning paths, creating a learner profile, tracking progress, and completing lessons.

## Run locally

```bash
npm install
npm run dev
```

## Current product surface

- Public landing page aligned with Kafil El Yatim's warm, optimistic visual language.
- Demo sign-up and login flows with learner state persisted in `localStorage`.
- Learner dashboard with active course progress, weekly learning activity, streak, and discovery recommendations.
- Course catalog with search, category filtering, save-for-later actions, and course detail pages.
- Lesson experience with a course outline, progress tracking, completion state, and next-lesson flow.
- Profile area with badges, stats, and saved course count.

The current auth and course data layers are deliberately isolated in `src/main.jsx` so they can be replaced with a secure API and role-aware permissions model in the next milestone.
