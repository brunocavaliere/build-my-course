import { config } from 'dotenv';

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

config({ path: '.env.local' });
config();

function getMigrationDatabaseUrl() {
  return (
    process.env.DATABASE_DIRECT_URL ??
    process.env.DATABASE_URL ??
    'postgresql://postgres:postgres@127.0.0.1:5432/buildmycourse'
  );
}

async function main() {
  const connectionString = getMigrationDatabaseUrl();
  const client = postgres(connectionString, {
    max: 1,
    prepare: false,
  });

  try {
    const db = drizzle(client);

    await migrate(db, {
      migrationsFolder: './drizzle',
    });
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
