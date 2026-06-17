import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from '@/db/schema';
import { env } from '@/env';

const sql = env.DATABASE_URL ? neon(env.DATABASE_URL) : null;

export const db = sql ? drizzle({ client: sql, schema }) : null;

export const isDatabaseConfigured = Boolean(db);
