import { migrateAuthTables } from './auth.js';

await migrateAuthTables();
console.log('Kafil Academy auth and application tables are ready.');
