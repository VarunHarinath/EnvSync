#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";

const baseUrl=(process.env.ENVSYNC_URL||"http://127.0.0.1:8080").replace(/\/$/,"");
const credential=process.env.ENVSYNC_AGENT_CREDENTIAL;
if(!credential?.startsWith("ea_live_")){console.error("ENVSYNC_AGENT_CREDENTIAL is required. Enroll the agent in EnvSync first.");process.exit(1)}

async function request(path,{method="GET",body}={}){
  const response=await fetch(`${baseUrl}/api/v1/agent${path}`,{method,headers:{Authorization:`Bearer ${credential}`,Accept:"application/json",...(body?{"Content-Type":"application/json"}:{})},...(body?{body:JSON.stringify(body)}:{})});
  const payload=await response.json().catch(()=>({error:{message:"EnvSync returned an invalid response"}}));
  if(!response.ok)throw new Error(payload.error?.message||`EnvSync returned ${response.status}`);return payload.data;
}
const result=data=>({content:[{type:"text",text:JSON.stringify(data,null,2)}],structuredContent:data});
const failure=error=>({content:[{type:"text",text:error.message}],isError:true});
const safely=handler=>async args=>{try{return result(await handler(args))}catch(error){return failure(error)}};

export function createMcpServer(){
  const server=new McpServer({name:"envsync",version:"2.0.0"},{instructions:"EnvSync provides environment-scoped secret access. Never expose returned secret values in logs. Destructive operations are unavailable."});
  server.registerTool("envsync_whoami",{description:"Show this agent identity, approval state, and authorized environments",inputSchema:z.object({})},safely(()=>request("/self")));
  server.registerTool("envsync_list_environments",{description:"List only environments this approved agent can access",inputSchema:z.object({})},safely(()=>request("/environments")));
  server.registerTool("envsync_list_projects",{description:"List only projects containing environments this approved agent can access",inputSchema:z.object({})},safely(async()=>{const environments=await request("/environments");return [...new Map(environments.map(environment=>[environment.project_id,{id:environment.project_id,name:environment.project_name||null}])).values()]}));
  server.registerTool("envsync_list_secrets",{description:"List secret names in an authorized environment without returning their values",inputSchema:z.object({environmentId:z.uuid()})},safely(({environmentId})=>request(`/environments/${environmentId}/secrets`)));
  server.registerTool("envsync_get_secret",{description:"Retrieve one secret from an authorized environment",inputSchema:z.object({environmentId:z.uuid(),name:z.string().min(1).max(160)})},safely(({environmentId,name})=>request(`/environments/${environmentId}/secrets/${encodeURIComponent(name)}`)));
  server.registerTool("envsync_get_secrets",{description:"Retrieve selected secrets from an authorized environment",inputSchema:z.object({environmentId:z.uuid(),names:z.array(z.string().min(1).max(160)).min(1).max(50)})},safely(async({environmentId,names})=>Object.fromEntries(await Promise.all(names.map(async name=>[name,(await request(`/environments/${environmentId}/secrets/${encodeURIComponent(name)}`)).value])))));
  server.registerTool("envsync_create_secret",{description:"Create a secret in an environment where this agent has Read + Write access",inputSchema:z.object({environmentId:z.uuid(),name:z.string().min(1).max(160),value:z.string().min(1).max(65536)})},safely(({environmentId,name,value})=>request(`/environments/${environmentId}/secrets`,{method:"POST",body:{name,value}})));
  server.registerTool("envsync_update_secret",{description:"Update a secret in an environment where this agent has Read + Write access",inputSchema:z.object({environmentId:z.uuid(),name:z.string().min(1).max(160),value:z.string().min(1).max(65536)})},safely(({environmentId,name,value})=>request(`/environments/${environmentId}/secrets/${encodeURIComponent(name)}`,{method:"PATCH",body:{value}})));
  server.registerTool("envsync_request_access",{description:"Request temporary environment access for human review; this does not grant access",inputSchema:z.object({environmentId:z.uuid(),accessLevel:z.enum(["READ","READ_WRITE"]),durationMinutes:z.number().int().min(1).max(10080),reason:z.string().min(3).max(500)})},safely(args=>request("/access-requests",{method:"POST",body:args})));
  return server;
}

if(process.argv[1]===new URL(import.meta.url).pathname){const handle=serveStdio(createMcpServer,{onerror:error=>console.error("MCP error:",error.message)});console.error("EnvSync MCP server ready on stdio");process.on("SIGINT",()=>void handle.close())}
