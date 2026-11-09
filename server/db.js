import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const databasePath = resolve(process.env.KAFIL_DATABASE_PATH ?? './data/kafil-academy.sqlite');
mkdirSync(dirname(databasePath), { recursive: true });

export const db = new DatabaseSync(databasePath);
db.exec('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;');

export function migrateAppTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_roles (
      user_id TEXT PRIMARY KEY,
      role TEXT NOT NULL DEFAULT 'learner' CHECK (role IN ('learner', 'mentor', 'content_editor', 'org_admin')),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS saved_courses (
      user_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, course_id)
    );

    CREATE TABLE IF NOT EXISTS lesson_completions (
      user_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      lesson_id INTEGER NOT NULL,
      completed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, course_id, lesson_id)
    );

    CREATE TABLE IF NOT EXISTS course_progress (
      user_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      progress INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
      last_lesson INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, course_id)
    );

    CREATE INDEX IF NOT EXISTS idx_lesson_completions_user ON lesson_completions(user_id);
    CREATE INDEX IF NOT EXISTS idx_course_progress_user ON course_progress(user_id);
  `);
}

export function ensureUserRole(userId, role = 'learner') {
  const safeRole = ['learner', 'mentor', 'content_editor', 'org_admin'].includes(role) ? role : 'learner';
  db.prepare(`INSERT INTO user_roles (user_id, role) VALUES (?, ?)
    ON CONFLICT(user_id) DO UPDATE SET role = excluded.role, updated_at = CURRENT_TIMESTAMP`).run(userId, safeRole);
}

export function getUserRole(userId) {
  return db.prepare('SELECT role FROM user_roles WHERE user_id = ?').get(userId)?.role ?? 'learner';
}
