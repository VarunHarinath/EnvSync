import { spawn } from "node:child_process";
import process from "node:process";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const children = [
  spawn(npm, ["run", "dev", "--workspace=envsync-webservice"], { stdio: "inherit" }),
  spawn(npm, ["run", "dev", "--workspace=Client"], { stdio: "inherit" }),
];
let stopping = false;
function stop(signal = "SIGTERM") { if (stopping) return; stopping = true; for (const child of children) child.kill(signal); }
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => stop(signal));
for (const child of children) child.on("exit", (code) => { if (!stopping) { stop(); process.exitCode = code || 0; } });
