#!/usr/bin/env node
import {readFile,stat,statfs,open} from 'node:fs/promises';
import path from 'node:path';
import {createInterface} from 'node:readline/promises';
import {Writable} from 'node:stream';
import {home,configPath,envPath,version,exists,load,saveInitial,requirements,compose,start,health} from '../lib/runtime.js';

const [command='help',...args]=process.argv.slice(2);
const option=name=>{const index=args.indexOf(`--${name}`);return index<0?undefined:args[index+1];};
const help=`EnvSync ${version} — self-hosted secrets\n\nCommands:\n  setup       Configure Personal or Business and create the owner\n  start       Start services and wait for health checks\n  stop        Stop services, preserving data\n  restart     Stop, then start\n  status      Show container status\n  doctor      Check installation and runtime health\n  logs        Show bounded operational logs (local operator access)\n  backup      Write a sensitive database archive (--output FILE)\n  restore     Restore an archive to an empty database (--input FILE --yes)\n  update      Check update-source availability; never auto-replace data\n  mcp serve   Run the client-launched STDIO adapter\n  mcp status  Check whether MCP is enabled\n  version     Show CLI version\n\nSetup options:\n  --profile personal|business --name NAME --port 8088\n  --api-image IMAGE --web-image IMAGE --no-mcp\n  --config FILE     Non-interactive bootstrap JSON (contains password; protect it)\n  --resume          Resume an interrupted setup using existing configuration\n\nConfig: ${home}\nNode 20+ and Docker with Compose v2 are required.\nMCP uses STDIO, not an HTTP endpoint. Never put agent credentials in arguments.\n`;
function ready(config){console.log(`\nEnvSync is running.\nProfile  ${config.profile}\nConsole  http://localhost:${config.port}\nMCP      ${config.mcpEnabled?'STDIO · envsync mcp serve (client-launched)':'Disabled'}\n\nRun later: envsync start`);}
async function questions() {
  if(!process.stdin.isTTY)throw new Error('Non-interactive setup requires --config FILE. See envsync setup --help.');
  let muted=false;
  const output=new Writable({write(chunk,_encoding,callback){if(!muted)process.stdout.write(chunk);callback();}});
  const rl=createInterface({input:process.stdin,output,terminal:true});
  rl.on('SIGINT',()=>{rl.close();process.exitCode=130;});
  const ask=async(label,fallback='')=>(await rl.question(`${label}${fallback?` [${fallback}]`:''}: `)).trim()||fallback;
  try {
    console.log('Welcome to EnvSync.\nPersonal: one developer. Business: users, sharing and team governance.');
    const profile=option('profile')||await ask('How will you use EnvSync? personal / business','personal');
    const fullName=await ask('Display name');
    const instanceName=option('name')||await ask('Instance name','My EnvSync');
    const organizationName=profile==='business'?await ask('Organization name'):instanceName;
    const email=await ask('Owner email');
    process.stdout.write('Owner password (12–128 characters, hidden): ');muted=true;
    const password=await rl.question('');muted=false;process.stdout.write('\n');
    const port=Number(option('port')||await ask('Port','8088'));
    const mcpEnabled=!args.includes('--no-mcp')&&(await ask('Enable MCP? yes / no','yes'))==='yes';
    return {profile,fullName,instanceName,organizationName,email,password,port,mcpEnabled};
  }finally{rl.close();}
}
async function setup() {
  if(await exists(configPath)&&!args.includes('--resume'))throw new Error('An instance is already configured. Use envsync start, or setup --resume after an interrupted bootstrap. Nothing was changed.');
  const source=option('config');
  let input;
  if(source){
    const info=await stat(source);
    if(process.platform!=='win32'&&(info.mode&0o077))throw new Error('Bootstrap config contains a password: restrict permissions to owner only.');
    input=JSON.parse(await readFile(source,'utf8'));
  }else input=await questions();
  if(typeof input.password!=='string'||input.password.length<12||input.password.length>128)throw new Error('Owner password must contain 12–128 characters.');
  const release=JSON.parse(await readFile(new URL('../runtime/release.json',import.meta.url),'utf8'));
  console.log('Checking Docker requirements…');await requirements();
  const config=args.includes('--resume')?await load():await saveInitial({...input,password:undefined,email:undefined,fullName:undefined,organizationName:undefined,apiImage:option('api-image')||input.apiImage||release.apiImage,webImage:option('web-image')||input.webImage||release.webImage});
  console.log('Preparing database…');await compose(config,['up','-d','--wait','db']);
  console.log('Running migrations and creating owner…');
  await compose(config,['run','--rm','-T','api','node','cli/bootstrap.js'],{input:JSON.stringify({...input,profile:config.profile,instanceName:config.instanceName,mcpEnabled:config.mcpEnabled,publicUrl:`http://localhost:${config.port}`})});
  input.password=undefined;
  console.log('Starting EnvSync…');await start(config);await health(config);ready(config);
  if(source)console.log('Remove the password-bearing bootstrap input file from your own secure storage when no longer needed.');
}
async function doctor(config) {
  console.log('ENVSYNC DOCTOR');
  for(const file of [configPath,envPath]){const info=await stat(file);if(process.platform!=='win32'&&(info.mode&0o077))throw new Error('Instance file permissions are too broad. Restrict instance.json/runtime.env to their owner.');}
  console.log(`Configuration ✓ (${config.profile})`);
  const disk=await statfs(home);if(Number(disk.bavail)*Number(disk.bsize)<100*1024*1024)throw new Error('Less than 100 MiB disk space available. Free space before continuing.');
  await requirements();console.log('Docker / Compose ✓');
  console.log(await compose(config,['ps']));
  await compose(config,['exec','-T','api','node','cli/diagnostics.js']);console.log('Database / migrations ✓');
  await health(config);console.log('API / console ✓');
  console.log(config.mcpEnabled?'MCP enabled · STDIO adapter; actual AI client connection UNVERIFIED':'MCP disabled');
  if(process.platform==='win32')console.log('Windows ACL permissions require operator verification.');
}
async function main(){
  if(command==='help'||command==='--help'||args.includes('--help'))return console.log(help);
  if(command==='version'||command==='--version')return console.log(version);
  if(command==='setup')return setup();
  if(!['start','stop','restart','status','doctor','logs','backup','restore','update','mcp'].includes(command))throw new Error('Unknown command. Run envsync --help.');
  const config=await load();
  if(command==='start'||command==='restart'){if(command==='restart')await compose(config,['stop']);await start(config);await health(config);return ready(config);}
  if(command==='stop')return void await compose(config,['stop']);
  if(command==='status')return console.log(await compose(config,['ps']));
  if(command==='doctor')return doctor(config);
  if(command==='logs')return void await compose(config,['logs','--tail','100'],{inherit:true});
  if(command==='update')throw new Error('No published update source is configured. Your running version and data were not changed. Back up before a controlled release upgrade.');
  if(command==='backup'){
    const destination=option('output');if(!destination)throw new Error('Use envsync backup --output FILE. Store the archive securely.');
    const file=await open(path.resolve(destination),'wx',0o600);
    try{await compose(config,['exec','-T','db','pg_dump','-U','envsync','-d','envsync','-Fc','--no-owner','--no-acl'],{outputStream:file.fd});}finally{await file.close();}
    console.log('Database archive created. Back up runtime.env separately and securely: losing the encryption key makes secrets unrecoverable.');return;
  }
  if(command==='restore'){
    const source=option('input');
    if(!source||!args.includes('--yes'))throw new Error('Use restore --input FILE --yes only with recovered configuration on a fresh, empty installation. Existing databases are refused.');
    await requirements();await compose(config,['up','-d','--wait','db']);
    const count=await compose(config,['exec','-T','db','psql','-U','envsync','-d','envsync','-Atc',"SELECT count(*) FROM information_schema.tables WHERE table_schema='public'"]);
    if(count.trim()!=='0')throw new Error('Restore refused: database is not empty. No data was overwritten. Restore to a separate fresh instance.');
    const file=await open(path.resolve(source),'r');
    try{await compose(config,['exec','-T','db','pg_restore','-U','envsync','-d','envsync','--exit-on-error','--single-transaction','--no-owner','--no-acl'],{inputStream:file.fd});}finally{await file.close();}
    console.log('Archive restored. Run envsync start and verify login and secret decryption with the matching master key.');return;
  }
  if(command==='mcp'){
    if(!config.mcpEnabled)throw new Error('MCP is disabled for this instance.');
    if(args[0]==='status')return console.log('MCP enabled. Transport: STDIO. Clients launch envsync mcp serve.');
    if(args[0]!=='serve')throw new Error('Use envsync mcp serve or envsync mcp status.');
    if(!process.env.ENVSYNC_AGENT_CREDENTIAL)throw new Error('Set ENVSYNC_AGENT_CREDENTIAL in the AI client environment, never in command arguments.');
    await compose(config,['exec','-T','-e','ENVSYNC_AGENT_CREDENTIAL','-e','ENVSYNC_URL=http://127.0.0.1:8080','api','node','mcp/server.js'],{inherit:true});
  }
}
main().catch(error=>{console.error(`EnvSync: ${error instanceof SyntaxError?'Invalid JSON configuration. Check its syntax.':error.message}`);process.exitCode=1;});
