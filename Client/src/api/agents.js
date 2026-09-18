import { client } from './client';
export const agentsApi={
  overview:()=>client('/mcp/overview'),
  list:(status)=>client(`/mcp/agents${status?`?status=${status}`:''}`),
  get:(id)=>client(`/mcp/agents/${id}`),
  environments:()=>client('/mcp/environments'),
  connect:(body)=>client('/mcp/agents/connect',{body}),
  environmentAgents:(id)=>client(`/mcp/environments/${id}/agents`),
  approve:(id,body)=>client(`/mcp/agents/${id}/approve`,{body}),
  reject:(id)=>client(`/mcp/agents/${id}/reject`,{body:{}}),
  revoke:(id)=>client(`/mcp/agents/${id}/revoke`,{body:{}}),
  assign:(id,environmentId,body)=>client(`/mcp/agents/${id}/assignments/${environmentId}`,{method:'PUT',body}),
  revokeAssignment:(id,environmentId)=>client(`/mcp/agents/${id}/assignments/${environmentId}`,{method:'DELETE'}),
  requests:()=>client('/mcp/agent-access-requests'),
  decide:(id,decision)=>client(`/mcp/agent-access-requests/${id}/decision`,{body:{decision}}),
  activity:()=>client('/mcp/agent-activity'),
};
