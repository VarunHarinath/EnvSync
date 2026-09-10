import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import process from "node:process";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const envPath=path.join(root,".env");
const docker=process.platform==="win32"?"docker.exe":"docker";
const c={cyan:"\x1b[36m",green:"\x1b[32m",yellow:"\x1b[33m",dim:"\x1b[2m",bold:"\x1b[1m",reset:"\x1b[0m"};
const line=()=>console.log(`${c.dim}────────────────────────────────────────────────────────${c.reset}`);
function step(number,title,detail){console.log(`\n${c.cyan}${c.bold}◆ ${number}  ${title}${c.reset}\n  ${c.dim}${detail}${c.reset}`)}
function run(args,{quiet=false}={}){const result=spawnSync(docker,args,{cwd:root,stdio:quiet?"pipe":"inherit",env:process.env,encoding:"utf8"});if(result.error)throw new Error("Docker is required. Install Docker Desktop or Docker Engine, start it, and rerun npm run setup.");if(result.status!==0)throw new Error(quiet?(result.stderr||"Docker command failed").trim():`docker ${args.join(" ")} failed`);return result.stdout}
function parseEnv(text){return Object.fromEntries(text.split(/\r?\n/).filter(x=>x&&!x.startsWith("#")&&x.includes("=")).map(x=>{const i=x.indexOf("=");return[x.slice(0,i),x.slice(i+1)]}))}
function valid(value){return value&&!/replace|change-me|generate/i.test(value)}
function prepareEnvironment(){const old=fs.existsSync(envPath)?parseEnv(fs.readFileSync(envPath,"utf8")):{};const values={POSTGRES_PASSWORD:valid(old.POSTGRES_PASSWORD)?old.POSTGRES_PASSWORD:crypto.randomBytes(24).toString("base64url"),JWT_SECRET:valid(old.JWT_SECRET)&&old.JWT_SECRET.length>=32?old.JWT_SECRET:crypto.randomBytes(48).toString("base64url"),ENVSYNC_MASTER_KEY:valid(old.ENVSYNC_MASTER_KEY)&&Buffer.from(old.ENVSYNC_MASTER_KEY,"base64").length===32?old.ENVSYNC_MASTER_KEY:crypto.randomBytes(32).toString("base64"),PUBLIC_URL:valid(old.PUBLIC_URL)?old.PUBLIC_URL:"http://localhost:8080",ENVSYNC_PORT:valid(old.ENVSYNC_PORT)?old.ENVSYNC_PORT:"8080"};fs.writeFileSync(envPath,Object.entries(values).map(([k,v])=>`${k}=${v}`).join("\n")+"\n",{mode:0o600});return values}

try{
  console.log(`\n${c.cyan}${c.bold}  ███████╗███╗   ██╗██╗   ██╗███████╗██╗   ██╗███╗   ██╗ ██████╗${c.reset}`);
  console.log(`${c.cyan}${c.bold}  EnvSync · private secrets infrastructure${c.reset}`);
  line();console.log(`  ${c.dim}A guided, Docker-native installation. Nothing is installed globally.${c.reset}`);
  step("01","Checking Docker","EnvSync runs its API, web console, and PostgreSQL entirely in containers.");run(["info"],{quiet:true});console.log(`  ${c.green}✓ Docker is ready${c.reset}`);
  step("02","Creating secure configuration","Generating database, signing, and encryption credentials locally.");const values=prepareEnvironment();console.log(`  ${c.green}✓ Configuration secured in .env${c.reset}`);
  step("03","Preparing the database","Starting isolated PostgreSQL and waiting until it accepts connections.");run(["compose","up","-d","--wait","db"]);console.log(`  ${c.green}✓ PostgreSQL is healthy${c.reset}`);
  step("04","Building EnvSync","Building production API and web console images for this machine.");run(["compose","build","api","web"]);console.log(`  ${c.green}✓ Application images are ready${c.reset}`);
  step("05","Configure your workspace","The database is ready. Create the organization and administrator below.");run(["compose","run","--rm","api","node","cli/envsync.js","setup","--docker"]);
  step("06","Starting EnvSync","Launching the complete application and checking service health.");run(["compose","up","-d","--wait"]);
  line();console.log(`\n  ${c.green}${c.bold}✓ EnvSync is ready${c.reset}\n  Open ${c.cyan}${c.bold}${values.PUBLIC_URL}${c.reset}\n  Status: ${c.dim}docker compose ps${c.reset}\n  Logs:   ${c.dim}docker compose logs -f${c.reset}\n  Stop:   ${c.dim}docker compose down${c.reset}\n`);
}catch(error){console.error(`\n${c.yellow}${c.bold}Setup stopped${c.reset}\n${error.message}\n\nYour database volume was preserved. Resolve the message above and rerun ${c.bold}npm run setup${c.reset}.`);process.exitCode=1}
