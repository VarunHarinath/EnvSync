import {readdir} from 'node:fs/promises';
import {pool} from '../db/pool.js';
try {
  const expected=(await readdir(new URL('../db/migrations/',import.meta.url))).filter(x=>x.endsWith('.sql'));
  const applied=(await pool.query('SELECT version FROM schema_migrations')).rows.map(x=>x.version);
  if(expected.some(x=>!applied.includes(x)))throw new Error();
  if(!(await pool.query('SELECT 1 FROM instance_settings WHERE id=true')).rowCount)throw new Error();
  console.log('Database and migrations healthy.');
}catch{console.error('Database, setup, or migration state is not ready.');process.exitCode=1;}finally{await pool.end();}
