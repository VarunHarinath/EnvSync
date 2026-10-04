import {spawn} from 'node:child_process';
import {readFile,writeFile,mkdir,stat,chmod} from 'node:fs/promises';
import {homedir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomBytes} from 'node:crypto';

export const version='1.0.0';
export const home=path.resolve(process.env.ENVSYNC_HOME || path.join(homedir(),'.envsync'));
const manifest=fileURLToPath(new URL('../runtime/compose.yml',import.meta.url));
export const configPath=path.join(home,'instance.json');
export const envPath=path.join(home,'runtime.env');
export function validate(config) {
  if(!config || !['personal','business'].includes(config.profile))throw new Error('Invalid profile. Choose personal or business.');
  if(!Number.isInteger(config.port)||config.port<1024||config.port>65535)throw new Error('Port must be between 1024 and 65535.');
  if(typeof config.instanceName!=='string'||!config.instanceName.trim()||config.instanceName.length>120)throw new Error('Instance name must contain 1–120 characters.');
  if(typeof config.mcpEnabled!=='boolean')throw new Error('mcpEnabled must be true or false.');
  for(const key of ['apiImage','webImage'])if(typeof config[key]!=='string'||!config[key]||!/^[a-zA-Z0-9./_:@-]+$/.test(config[key]))throw new Error('No valid runtime image source. Supply --api-image and --web-image. Registry delivery is not yet configured.');
  if(config.version!==version)throw new Error('CLI/runtime configuration version mismatch. Use the matching CLI; do not overwrite this installation.');
  if(!/^envsync-[a-f0-9]{12}$/.test(config.projectName))throw new Error('Invalid runtime project name.');
  return config;
}
export async function exists(file) {try{await stat(file);return true;}catch(e){if(e.code==='ENOENT')return false;throw e;}}
export async function load() {
  if(!await exists(configPath))throw new Error('No instance configured. Run envsync setup.');
  let parsed;try{parsed=JSON.parse(await readFile(configPath,'utf8'));}catch{throw new Error('Cannot read instance.json. Restore a valid configuration; do not delete your database.');}
  return validate(parsed);
}
export async function saveInitial(input) {
  if(await exists(configPath)||await exists(envPath))throw new Error('Instance files already exist. Use start or setup --resume; files and volumes were preserved.');
  const {profile,instanceName,port,mcpEnabled,apiImage,webImage}=input;
  const config=validate({profile,instanceName,port,mcpEnabled,apiImage,webImage,version,projectName:`envsync-${randomBytes(6).toString('hex')}`});
  await mkdir(home,{recursive:true,mode:0o700});
  if(process.platform!=='win32')await chmod(home,0o700);
  const env=[`POSTGRES_PASSWORD=${randomBytes(32).toString('hex')}`,`JWT_SECRET=${randomBytes(48).toString('hex')}`,`ENVSYNC_MASTER_KEY=${randomBytes(32).toString('base64')}`].join('\n')+'\n';
  await writeFile(envPath,env,{flag:'wx',mode:0o600});
  await writeFile(configPath,JSON.stringify(config,null,2)+'\n',{flag:'wx',mode:0o600});
  return config;
}
export function run(args,{input,inherit=false,extraEnv={},outputStream,inputStream}={}) {
  return new Promise((resolve,reject)=>{
    const child=spawn('docker',args,{shell:false,env:{...process.env,...extraEnv},stdio:[inputStream??(input===undefined?(inherit?'inherit':'ignore'):'pipe'),outputStream??(inherit?'inherit':'pipe'),inherit?'inherit':'pipe']});
    let output='';
    child.stdout?.on('data',chunk=>{if(output.length<1048576)output+=chunk.toString();});
    // Classify known diagnostics without printing arbitrary credential-bearing stderr.
    let diagnostic='';
    child.stderr?.on('data',chunk=>{if(diagnostic.length<65536)diagnostic+=chunk.toString();});
    child.on('error',()=>reject(new Error('Docker could not run. Install/start Docker Desktop or Docker Engine with Compose v2.')));
    child.on('exit',(code,signal)=>{
      const hint=/address pools|fully subnetted/.test(diagnostic)?' Docker network address pools are exhausted. Remove only verified unused networks or configure additional Docker address pools.':/port is already allocated|address already in use/.test(diagnostic)?' The selected port is occupied. Stop its owner or choose another port.':/no space left on device/.test(diagnostic)?' Docker storage is full. Free space without deleting database volumes.':'';
      code===0?resolve(output):reject(new Error(`Docker operation failed${signal?' (interrupted)':''}.${hint} Run envsync doctor. Data and configuration were preserved.`));
    });
    if(input!==undefined){child.stdin.on('error',()=>{});child.stdin.end(input);}
  });
}
export const runtimeEnv=config=>({ENVSYNC_API_IMAGE:config.apiImage,ENVSYNC_WEB_IMAGE:config.webImage,ENVSYNC_PORT:String(config.port)});
export async function compose(config,args,options={}) {
  const material=Object.fromEntries((await readFile(envPath,'utf8')).trim().split('\n').map(line=>{const index=line.indexOf('=');return [line.slice(0,index),line.slice(index+1)];}));
  if(!/^[a-f0-9]{64}$/.test(material.POSTGRES_PASSWORD||'')||!/^[a-f0-9]{96}$/.test(material.JWT_SECRET||'')||Buffer.from(material.ENVSYNC_MASTER_KEY||'','base64').length!==32)throw new Error('Runtime key file is invalid. Restore its original secure backup; never regenerate the encryption key for existing data.');
  return run(['compose','--project-name',config.projectName,'--env-file',envPath,'-f',manifest,...args],{...options,extraEnv:{...material,...runtimeEnv(config),...options.extraEnv}});
}
export async function requirements() {await run(['info','--format','{{.ServerVersion}}']);await run(['compose','version','--short']);}
export async function start(config) {await requirements();await compose(config,['up','-d','--wait','--wait-timeout','180']);}
export async function health(config) {
  for(const route of ['/','/api/v1/auth/me']) {
    const response=await fetch(`http://127.0.0.1:${config.port}${route}`,{signal:AbortSignal.timeout(10000)});
    if(route==='/'?!response.ok:response.status!==401)throw new Error('Console/API health check failed. Run envsync doctor.');
  }
}
