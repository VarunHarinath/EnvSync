// Installer-only bootstrap. Input is stdin, never password-bearing argv.
import {z} from 'zod';
import {migrate} from '../db/migrate.js';
import {pool,transaction} from '../db/pool.js';
import {hashPassword} from '../lib/security.js';
try {
  let text='';for await(const chunk of process.stdin){text+=chunk;if(text.length>16384)throw new Error('Input too large');}
  const input=z.object({profile:z.enum(['personal','business']),instanceName:z.string().min(1).max(120),organizationName:z.string().max(120).optional(),fullName:z.string().min(1).max(120),email:z.email(),password:z.string().min(12).max(128),mcpEnabled:z.boolean(),publicUrl:z.url()}).parse(JSON.parse(text));
  await migrate();
  const passwordHash=await hashPassword(input.password);
  await transaction(async db=>{
    await db.query('SELECT pg_advisory_xact_lock(1701737327)');
    if((await db.query('SELECT 1 FROM users LIMIT 1')).rowCount)throw new Error('An owner already exists; use start. Bootstrap will not overwrite users.');
    const owner=(await db.query("INSERT INTO users(full_name,email,password_hash,role,permissions) VALUES($1,lower($2),$3,'ADMIN',$4) RETURNING id",[input.fullName,input.email,passwordHash,{read:true,write:true,can_pull_secrets:true,mcp_read:true,mcp_write:true}])).rows[0];
    await db.query('INSERT INTO instance_settings(organization_name,instance_name,public_url,profile,mcp_enabled,owner_user_id) VALUES($1,$2,$3,$4,$5,$6)',[input.organizationName||input.instanceName,input.instanceName,input.publicUrl,input.profile,input.mcpEnabled,owner.id]);
  });
  console.log('Owner and instance created.');
}catch{console.error('Bootstrap failed. Verify inputs and database state; an existing owner is never overwritten.');process.exitCode=1;}finally{await pool.end();}
