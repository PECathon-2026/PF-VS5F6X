import { runMigrations } from '../src/db/migrate';

if (require.main === module) {
  runMigrations();
}
