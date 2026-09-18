import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { query } from "./db/pool.js";
import { AppError } from "./lib/errors.js";
import { authRouter } from "./routes/auth.js";
import { resourcesRouter } from "./routes/resources.js";
import { agentEnrollmentRouter,agentRouter,agentManagementRouter } from "./routes/agents.js";

export function createApp() {
  const app=express(); if(config.trustProxy) app.set("trust proxy",1); app.disable("x-powered-by");
  app.use((req,res,next)=>{ res.setHeader("X-Content-Type-Options","nosniff");res.setHeader("X-Frame-Options","DENY");res.setHeader("Referrer-Policy","no-referrer");res.setHeader("Permissions-Policy","camera=(), microphone=(), geolocation=()");next(); });
  app.use(cors({ origin(origin,callback){ callback(null,!origin||config.corsOrigins.includes(origin)); }, credentials:true })); app.use(express.json({limit:"1mb"}));
  app.get("/health",(_req,res)=>res.json({status:"ok",service:"envsync-api"}));
  app.get("/ready",async(_req,res)=>{try{await query("SELECT 1");res.json({status:"ready"});}catch{res.status(503).json({status:"unavailable"});}});
  app.use("/api/v1/auth",authRouter);app.use("/api/v1/agents",agentEnrollmentRouter);app.use("/api/v1/agent",agentRouter);app.use("/api/v1/mcp",agentManagementRouter);app.use("/api/v1",resourcesRouter);
  app.use((_req,res)=>res.status(404).json({success:false,error:{code:"NOT_FOUND",message:"Route not found"}}));
  app.use((error,req,res,_next)=>{ const known=error instanceof AppError; const status=known?error.status:(error.code==="23505"?409:500); const code=known?error.code:(status===409?"CONFLICT":"INTERNAL_ERROR"); if(status===500) console.error(`[${req.method} ${req.path}]`,error.message); res.status(status).json({success:false,error:{code,message:known?error.message:(status===409?"A resource with that value already exists":"An unexpected error occurred"),...(known&&error.details?{details:error.details}:{})}}); });
  return app;
}
