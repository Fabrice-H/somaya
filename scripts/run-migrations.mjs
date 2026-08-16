import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = 'https://bajmzmpfvpcgodhuoxoo.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJham16bXBmdnBjZ29kaHVveG9vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTU4NDkzNCwiZXhwIjoyMTAxMTYwOTM0fQ.A7j-iilAjo5LmwzwQR51Ry377_de95-cF07B5kwTmNQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigrations() {
  console.log('Running migrations...\n');

  // Read migration file
  const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '001_initial_schema.sql');
  const sql = readFileSync(migrationPath, 'utf-8');

  // Split by semicolons and filter empty statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  let successCount = 0;
  let errorCount = 0;

  for (const statement of statements) {
    // Skip comments-only statements
    if (statement.split('\n').every(line => line.trim().startsWith('--') || line.trim() === '')) {
      continue;
    }

    try {
      const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
      if (error) {
        // Try direct query approach
        const { error: queryError } = await supabase.from('_migrations').select().limit(0);
        if (queryError) {
          console.log(`Note: ${statement.substring(0, 50)}... - will be run via SQL editor`);
        }
      } else {
        successCount++;
      }
    } catch (e) {
      // Expected for most statements since rpc won't work
    }
  }

  console.log('\nMigration SQL prepared. Please run it in Supabase SQL Editor.');
  console.log('Go to: https://supabase.com/dashboard/project/bajmzmpfvpcgodhuoxoo/sql/new');
  console.log('\nAlternatively, copy the SQL from: supabase/migrations/001_initial_schema.sql');
}

runMigrations().catch(console.error);
