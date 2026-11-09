import { createServer } from 'node:http';
import { auth, migrateAuthTables } from './auth.js';
import { db, ensureUserRole, getUserRole } from './db.js';
import { courses, findCourse } from './data.js';

const port = Number(process.env.PORT ?? 4000);
const allowedOrigins = new Set([process.env.APP_ORIGIN ?? 'http://localhost:5173', 'http://localhost:5173', 'http://localhost:5174']);

function setSecurityHeaders(response) {
  const developmentSources = process.env.NODE_ENV === 'production' ? "'self'" : "'self' http://localhost:5173 ws://localhost:5173";
  response.setHeader('Content-Security-Policy', `default-src 'self'; connect-src ${developmentSources}; img-src 'self' data: https://images.unsplash.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`);
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('X-Frame-Options', 'DENY');
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
}

function setCorsHeaders(response, request) {
  const origin = request.headers.origin;
  const localDevelopmentOrigin = process.env.NODE_ENV !== 'production' && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin ?? '');
  if (allowedOrigins.has(origin) || localDevelopmentOrigin || origin === `http://localhost:${port}`) {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    response.setHeader('Vary', 'Origin');
  }
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) reject(new Error('Request body too large'));
    });
    request.on('end', () => resolve(body));
    request.on('error', reject);
  });
}

function json(response, payload, status = 200) {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(payload));
}

function toRequest(request, url, body) {
  return new Request(url, {
    method: request.method,
    headers: request.headers,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : body,
    duplex: 'half',
  });
}

async function sessionFor(request) {
  return auth.api.getSession({ headers: request.headers });
}

function progressForUser(userId) {
  return db.prepare(`SELECT course_id AS courseId, progress, last_lesson AS lastLesson, updated_at AS updatedAt
    FROM course_progress WHERE user_id = ? ORDER BY updated_at DESC`).all(userId);
}

function savedForUser(userId) {
  return db.prepare('SELECT course_id AS courseId FROM saved_courses WHERE user_id = ? ORDER BY created_at DESC').all(userId).map((row) => row.courseId);
}

function requireRole(role, allowedRoles) {
  if (!allowedRoles.includes(role)) {
    const error = new Error('Forbidden');
    error.status = 403;
    throw error;
  }
}

async function handleApi(request, response, url) {
  if (url.pathname === '/api/health') return json(response, { status: 'ok', service: 'kafil-academy-api' });
  if (url.pathname === '/api/courses' && request.method === 'GET') return json(response, { courses });

  const webRequest = toRequest(request, url, request.bodyText);
  const session = await sessionFor(webRequest);
  if (!session?.user) return json(response, { error: 'Authentication required' }, 401);

  ensureUserRole(session.user.id);
  const role = getUserRole(session.user.id);

  if (url.pathname === '/api/me' && request.method === 'GET') {
    return json(response, { user: { ...session.user, role }, progress: progressForUser(session.user.id), savedCourses: savedForUser(session.user.id) });
  }

  if (url.pathname === '/api/me/progress' && request.method === 'GET') {
    return json(response, { progress: progressForUser(session.user.id), savedCourses: savedForUser(session.user.id) });
  }

  const saveMatch = url.pathname.match(/^\/api\/courses\/([a-z-]+)\/save$/);
  if (saveMatch && request.method === 'POST') {
    const course = findCourse(saveMatch[1]);
    if (!course) return json(response, { error: 'Course not found' }, 404);
    const body = request.bodyText ? JSON.parse(request.bodyText) : {};
    if (body.saved === true) db.prepare('INSERT OR IGNORE INTO saved_courses (user_id, course_id) VALUES (?, ?)').run(session.user.id, course.id);
    else db.prepare('DELETE FROM saved_courses WHERE user_id = ? AND course_id = ?').run(session.user.id, course.id);
    return json(response, { savedCourses: savedForUser(session.user.id) });
  }

  const lessonMatch = url.pathname.match(/^\/api\/courses\/([a-z-]+)\/lessons\/(\d+)\/complete$/);
  if (lessonMatch && request.method === 'POST') {
    const course = findCourse(lessonMatch[1]);
    const lessonId = Number(lessonMatch[2]);
    if (!course || lessonId < 1 || lessonId > course.lessons) return json(response, { error: 'Lesson not found' }, 404);
    db.prepare('INSERT OR IGNORE INTO lesson_completions (user_id, course_id, lesson_id) VALUES (?, ?, ?)').run(session.user.id, course.id, lessonId);
    const completed = db.prepare('SELECT COUNT(*) AS count FROM lesson_completions WHERE user_id = ? AND course_id = ?').get(session.user.id, course.id).count;
    const progress = Math.min(100, Math.round((completed / course.lessons) * 100));
    db.prepare(`INSERT INTO course_progress (user_id, course_id, progress, last_lesson) VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, course_id) DO UPDATE SET progress = excluded.progress, last_lesson = excluded.last_lesson, updated_at = CURRENT_TIMESTAMP`).run(session.user.id, course.id, progress, lessonId);
    return json(response, { courseId: course.id, progress, lastLesson: lessonId });
  }

  if (url.pathname === '/api/admin/overview' && request.method === 'GET') {
    requireRole(role, ['content_editor', 'org_admin']);
    const userCount = db.prepare('SELECT COUNT(*) AS count FROM user').get().count;
    const completionCount = db.prepare('SELECT COUNT(*) AS count FROM lesson_completions').get().count;
    return json(response, { role, metrics: { users: userCount, completedLessons: completionCount, courses: courses.length } });
  }

  if (url.pathname === '/api/mentor/learners' && request.method === 'GET') {
    requireRole(role, ['mentor', 'org_admin']);
    const learners = db.prepare(`SELECT u.id, u.name, u.email, COALESCE(ur.role, 'learner') AS role
      FROM user u LEFT JOIN user_roles ur ON ur.user_id = u.id ORDER BY u.createdAt DESC LIMIT 100`).all();
    return json(response, { learners });
  }

  return json(response, { error: 'Not found' }, 404);
}

const server = createServer(async (request, response) => {
  setSecurityHeaders(response);
  setCorsHeaders(response, request);
  if (request.method === 'OPTIONS') return response.end();
  const url = new URL(request.url, `http://${request.headers.host ?? `localhost:${port}`}`);
  try {
    const bodyText = ['GET', 'HEAD'].includes(request.method) ? '' : await readBody(request);
    request.bodyText = bodyText;
    if (url.pathname.startsWith('/api/auth/')) {
      const webRequest = toRequest(request, url, bodyText);
      const authResponse = await auth.handler(webRequest);
      response.statusCode = authResponse.status;
      authResponse.headers.forEach((value, key) => response.setHeader(key, value));
      response.end(Buffer.from(await authResponse.arrayBuffer()));
      return;
    }
    if (url.pathname.startsWith('/api/')) return await handleApi(request, response, url);
    return json(response, { error: 'Not found' }, 404);
  } catch (error) {
    console.error(error);
    return json(response, { error: error.status === 403 ? 'Forbidden' : 'Internal server error' }, error.status ?? 500);
  }
});

await migrateAuthTables();
server.listen(port, () => console.log(`Kafil Academy API listening on http://localhost:${port}`));
