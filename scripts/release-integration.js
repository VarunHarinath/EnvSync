// Opt-in integration test: creates isolated Compose projects and retains stopped
// volumes/config for investigation. Never targets the developer's live project.
import {mkdtemp,writeFile,readFile,copyFile,mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import {randomBytes,randomUUID} from 'node:crypto';
import assert from 'node:assert/strict';
import {EnvSync} from '../sdk/node/src/index.js';

const root=fileURLToPath(new URL('../',import.meta.url));
const folder=await mkdtemp(path.join(tmpdir(),'envsync-release-'));
const npm=process.platform==='win32'?'npm.cmd':'npm';
async function command(exe,args,env={},cwd=root){return new Promise((resolve,reject)=>{
  const child=spawn(exe,args,{cwd,env:{...process.env,...env},stdio:['ignore','pipe','pipe']});let output='';
  child.stdout.on('data',x=>output+=x);child.stderr.on('data',x=>output+=x);
  child.on('error',reject);child.on('exit',code=>code===0?resolve(output):reject(new Error(`Command ${args[0]} failed: ${output}`)));
});}
const packed=JSON.parse(await command(npm,['pack','--json','--ignore-scripts','--pack-destination',folder,'--cache',path.join(folder,'npm-cache')],{},path.join(root,'cli')))[0];
const prefix=path.join(folder,'installed');
await command(npm,['install','--global','--prefix',prefix,'--ignore-scripts','--cache',path.join(folder,'npm-cache'),path.join(folder,packed.filename)]);
const executable=process.platform==='win32'?path.join(prefix,'node_modules','envsync','bin','envsync.js'):path.join(prefix,'lib','node_modules','envsync','bin','envsync.js');
const cli=(instance,args)=>command(process.execPath,[executable,...args],{ENVSYNC_HOME:instance});
const instances=[];
async function api(port,route,{token,cookie,method='GET',body,status=200,origin}={}){
  const response=await fetch(`http://127.0.0.1:${port}/api/v1${route}`,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`} : {}),...(cookie?{Cookie:cookie}:{}),...(origin?{Origin:origin}:{})},...(body?{body:JSON.stringify(body)}:{})});
  const result=await response.json();assert.equal(response.status,status,`${method} ${route}: ${JSON.stringify(result.error)}`);
  return {data:result.data,cookie:response.headers.get('set-cookie')?.split(';')[0]};
}
try {
  for(const [index,profile] of ['personal','business'].entries()){
    const instance=path.join(folder,profile),port=18880+index;
    const password=randomBytes(24).toString('base64url');
    const input={profile,instanceName:'Release test',organizationName:'Example',fullName:'Test Owner',email:'owner@example.invalid',password,port,mcpEnabled:true,apiImage:process.env.TEST_API_IMAGE||'envsync-release-api:1.0.0',webImage:process.env.TEST_WEB_IMAGE||'envsync-release-web:1.0.0'};
    const config=path.join(folder,`${profile}-bootstrap.json`);await writeFile(config,JSON.stringify(input),{mode:0o600});
    instances.push(instance);
    await cli(instance,['setup','--config',config]);console.log(`PASS ${profile}: installed tarball setup`);
    await cli(instance,['start']);await cli(instance,['doctor']);
    const runtime=JSON.parse(await readFile(path.join(instance,'instance.json'),'utf8'));
    await Promise.all([1,2].map(()=>command('docker',['exec',`${runtime.projectName}-api-1`,'node','db/migrate.js'])));
    assert.equal((await readFile(path.join(instance,'instance.json'),'utf8')).includes(password),false);
    await assert.rejects(cli(instance,['setup','--config',config]),/already configured/);
    const login=await api(port,'/auth/login',{method:'POST',body:{email:input.email,password}});
    let token=login.data.accessToken;
    const me=(await api(port,'/auth/me',{token})).data;assert.equal(me.profile,profile);assert.equal(me.capabilities.teamManagement,profile==='business');
    await api(port,'/users',{token,status:profile==='business'?200:403});
    await api(port,'/teammates',{token,status:profile==='business'?200:403});
    await api(port,'/auth/login',{method:'POST',body:{email:input.email,password:'wrong-password'},status:401});
    await api(port,'/projects',{token,method:'POST',body:{name:'CSRF'},origin:'https://untrusted.invalid',status:403});
    const project=(await api(port,'/projects',{token,method:'POST',body:{name:'Release test'},status:201})).data;
    const env=(await api(port,`/projects/${project.id}/environments`,{token,method:'POST',body:{name:'Development'},status:201})).data;
    const prod=(await api(port,`/projects/${project.id}/environments`,{token,method:'POST',body:{name:'Production'},status:201})).data;
    const value='example-secret';
    const secret=(await api(port,`/projects/${project.id}/secrets`,{token,method:'POST',body:{name:'EXAMPLE_SECRET',value,environmentIds:[env.id]},status:201})).data;
    assert.equal((await api(port,`/secrets/${secret.id}/reveal`,{token,method:'POST',body:{}})).data.value,value);
    const key=(await api(port,`/projects/${project.id}/api-keys`,{token,method:'POST',body:{name:'SDK test',environmentId:env.id},status:201})).data;
    assert.equal((await api(port,'/sdk/secrets/EXAMPLE_SECRET',{token:key.key})).data.value,value);
    assert.equal(await new EnvSync({apiKey:key.key,baseUrl:`http://127.0.0.1:${port}`}).get('EXAMPLE_SECRET'),value);
    const clone=(await api(port,`/environments/${env.id}/clone`,{token,method:'POST',body:{name:'Clone'},status:201})).data;
    assert.equal((await api(port,`/environments/${clone.id}/secrets`,{token})).data.length,1);
    await api(port,`/environments/${clone.id}`,{token,method:'DELETE'});
    await api(port,`/secrets/${secret.id}`,{token,method:'PATCH',body:{value:'example-secret'}});
    const stored=await command('docker',['exec',`${runtime.projectName}-db-1`,'psql','-U','envsync','-d','envsync','-Atc',"SELECT count(*) FROM secrets WHERE encode(ciphertext,'escape')='example-secret'"]);
    assert.equal(stored.trim(),'0');
    await api(port,`/sdk/secrets?environmentId=${prod.id}`,{token:key.key,status:403});
    await api(port,`/sdk/secrets?projectId=${project.id}`,{token,status:403});
    const agent=(await api(port,'/mcp/agents/connect',{token,method:'POST',body:{displayName:'Test Agent',clientName:'Integration',assignments:[{environmentId:env.id,accessLevel:'READ_WRITE'}]},status:201})).data;
    assert.equal((await api(port,`/agent/environments/${env.id}/secrets/EXAMPLE_SECRET`,{token:agent.credential})).data.value,value);
    await api(port,`/agent/environments/${prod.id}/secrets`,{token:agent.credential,status:403});
    await api(port,`/environments/${prod.id}/secrets/${secret.id}`,{token,method:'POST',body:{},status:201});
    await api(port,`/agent/environments/${env.id}/secrets/EXAMPLE_SECRET`,{token:agent.credential,method:'PATCH',body:{value:'must-not-write'},status:403});
    await api(port,`/mcp/agents/${agent.agent.id}/assignments/${env.id}`,{token,method:'PUT',body:{accessLevel:'READ',expiresAt:new Date(Date.now()-60000).toISOString()}});
    await api(port,`/agent/environments/${env.id}/secrets`,{token:agent.credential,status:403});
    await api(port,`/mcp/agents/${agent.agent.id}/revoke`,{token,method:'POST',body:{}});
    await api(port,'/agent/self',{token:agent.credential,status:401});
    await api(port,`/api-keys/${key.id}/revoke`,{token,method:'POST',body:{}});
    await api(port,'/sdk/secrets',{token:key.key,status:401});
    if(profile==='business'){
      const member=(await api(port,'/users',{token,method:'POST',body:{fullName:'Member',email:'member@example.invalid',password,role:'USER'},status:201})).data;
      const memberToken=(await api(port,'/auth/login',{method:'POST',body:{email:'member@example.invalid',password}})).data.accessToken;
      assert.equal((await api(port,'/projects',{token:memberToken})).data.length,0);
      await api(port,`/projects/${project.id}`,{token:memberToken,status:403});
      await api(port,`/PROJECTS/${project.id}`,{token:memberToken,status:403});
      await api(port,`/SECRETS/${secret.id}/REVEAL`,{token:memberToken,method:'POST',body:{},status:403});
      await api(port,`/shares/environment/${env.id}`,{token,method:'POST',body:{userId:member.id,permission:'READ'},status:201});
      assert.equal((await api(port,`/projects/${project.id}/environments`,{token:memberToken})).data.length,1);
      await api(port,`/environments/${env.id}`,{token:memberToken,method:'PATCH',body:{name:'No'},status:403});
      await api(port,`/secrets/${secret.id}/reveal`,{token:memberToken,method:'POST',body:{},status:403});
      await api(port,'/users',{token:memberToken,status:403});
      await api(port,`/shares/environment/${env.id}`,{token,method:'POST',body:{userId:member.id,permission:'WRITE'},status:201});
      await api(port,`/environments/${env.id}`,{token:memberToken,method:'PATCH',body:{name:'Development renamed'}});
      await api(port,`/secrets/${secret.id}`,{token:memberToken,method:'PATCH',body:{value:'must-not-write'},status:403});
      const owned=(await api(port,'/projects',{token:memberToken,method:'POST',body:{name:'Member project'},status:201})).data;
      await api(port,`/projects/${owned.id}`,{token:memberToken,method:'DELETE'});
      console.log('PASS business: unrelated resources denied, READ sharing and global SDK ceiling');
    }
    const audit=(await api(port,'/audit-logs',{token})).data;assert.ok(audit.length>0);assert.equal(JSON.stringify(audit).includes(value),false);
    const operational=await cli(instance,['logs']);assert.equal(operational.includes(value),false);assert.equal(operational.includes(password),false);assert.equal(operational.includes(key.key),false);
    await cli(instance,['restart']);
    assert.equal((await api(port,`/secrets/${secret.id}/reveal`,{token,method:'POST',body:{}})).data.value,value);
    const refreshResponses=await Promise.all([1,2].map(()=>fetch(`http://127.0.0.1:${port}/api/v1/auth/refresh`,{method:'POST',headers:{Cookie:login.cookie,'Content-Type':'application/json'},body:'{}'})));
    assert.deepEqual(refreshResponses.map(r=>r.status).sort(),[200,401]);
    const refreshed=refreshResponses.find(r=>r.status===200);token=(await refreshed.json()).data.accessToken;
    await api(port,'/auth/me',{token:login.data.accessToken,status:401});
    await api(port,'/auth/logout',{method:'POST',cookie:refreshed.headers.get('set-cookie').split(';')[0],body:{}});
    await api(port,'/auth/me',{token,status:401});
    const archive=path.join(folder,`${profile}.dump`);await cli(instance,['backup','--output',archive]);
    const recovery=path.join(folder,`${profile}-recovered`);await mkdir(recovery,{mode:0o700});
    const recoveredConfig=JSON.parse(await readFile(path.join(instance,'instance.json'),'utf8'));recoveredConfig.projectName=`envsync-${randomBytes(6).toString('hex')}`;recoveredConfig.port=18890+index;
    await writeFile(path.join(recovery,'instance.json'),JSON.stringify(recoveredConfig),{mode:0o600});await copyFile(path.join(instance,'runtime.env'),path.join(recovery,'runtime.env'));instances.push(recovery);
    await cli(recovery,['restore','--input',archive,'--yes']);await cli(recovery,['start']);
    const restoredToken=(await api(recoveredConfig.port,'/auth/login',{method:'POST',body:{email:input.email,password}})).data.accessToken;
    assert.equal((await api(recoveredConfig.port,`/secrets/${secret.id}/reveal`,{token:restoredToken,method:'POST',body:{}})).data.value,value);
    await assert.rejects(cli(recovery,['restore','--input',archive,'--yes']),/not empty/);
    console.log(`PASS ${profile}: core CRUD, scopes, agent TTL/revocation, refresh race, logout, persistence, backup/restore`);
  }
  console.log(`PASS installed package integration. Isolated stopped test data retained in ${folder}`);
}finally{
  for(const instance of instances)try{
    await command(process.execPath,['--input-type=module','-e',`const {load,compose}=await import(${JSON.stringify(new URL('../cli/lib/runtime.js',import.meta.url).href)});await compose(await load(),['down']);`],{ENVSYNC_HOME:instance});
  }catch{console.error('Test cleanup could not remove an isolated runtime; inspect the test directory. Volumes were preserved.');}
}
