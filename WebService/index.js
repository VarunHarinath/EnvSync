import { createApp } from "./app.js";
import { config } from "./config.js";
import { migrate } from "./db/migrate.js";
import { pool } from "./db/pool.js";

await migrate();
const server=createApp().listen(config.port,config.host,()=>console.log(`EnvSync API listening on ${config.host}:${config.port}`));
let stopping=false;
const shutdown=()=>{if(stopping)return;stopping=true;server.close(async()=>{await pool.end();process.exit(0)});setTimeout(()=>process.exit(1),15000).unref();}; process.on("SIGTERM",shutdown);process.on("SIGINT",shutdown);
