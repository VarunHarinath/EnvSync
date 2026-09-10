import { createApp } from "./app.js";
import { config } from "./config.js";
import { migrate } from "./db/migrate.js";

await migrate();
const server=createApp().listen(config.port,config.host,()=>console.log(`EnvSync API listening on ${config.host}:${config.port}`));
const shutdown=()=>server.close(()=>process.exit(0)); process.on("SIGTERM",shutdown);process.on("SIGINT",shutdown);
