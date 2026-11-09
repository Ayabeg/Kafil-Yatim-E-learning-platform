import { betterAuth } from 'better-auth';
import { getMigrations } from 'better-auth/db/migration';
import { db, ensureUserRole, migrateAppTables } from './db.js';

const isProduction = process.env.NODE_ENV === 'production';
const secret = process.env.BETTER_AUTH_SECRET ?? (isProduction ? '' : 'local-development-secret-change-me');

if (!secret) throw new Error('BETTER_AUTH_SECRET must be set in production.');

migrateAppTables();

export const auth = betterAuth({
  database: db,
  secret,
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:4000',
  basePath: '/api/auth',
  trustedOrigins: [process.env.APP_ORIGIN ?? 'http://localhost:5173', 'http://localhost:*', 'http://127.0.0.1:*', 'http://localhost:4000'],
  emailAndPassword: { enabled: true, minPasswordLength: 8, maxPasswordLength: 128 },
  session: { expiresIn: 60 * 60 * 24 * 30, updateAge: 60 * 60 * 24 },
  rateLimit: { enabled: true, window: 60, max: 100, storage: 'database' },
  advanced: { useSecureCookies: isProduction },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const configuredAdmin = process.env.ADMIN_EMAIL?.trim().toLowerCase();
          const role = configuredAdmin && user.email.toLowerCase() === configuredAdmin ? 'org_admin' : 'learner';
          ensureUserRole(user.id, role);
        },
      },
    },
  },
});

export async function migrateAuthTables() {
  const { runMigrations } = await getMigrations(auth.options);
  await runMigrations();
}
