const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres:rBipyr8D2ffPQkuf@db.kkzjwfpzctgxgxupjfej.supabase.co:5432/postgres';

async function run() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to Supabase DB');
    
    const sql = fs.readFileSync(path.join(__dirname, 'supabase', 'schema.sql'), 'utf8');
    await client.query(sql);
    console.log('Schema successfully applied!');
  } catch (err) {
    console.error('Error applying schema:', err);
  } finally {
    await client.end();
  }
}

run();
