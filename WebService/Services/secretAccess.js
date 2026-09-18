import { query } from "../db/pool.js";
import { decryptSecret, encryptSecret } from "../lib/security.js";
import { errors } from "../lib/errors.js";
import { authorizeAgentEnvironment } from "./agentPolicy.js";
import { audit } from "./audit.js";

const safeName=/^[A-Za-z_][A-Za-z0-9_.-]{0,159}$/;
async function authorize(req,environmentId,required,action){try{return await authorizeAgentEnvironment(req.agent.id,environmentId,required)}catch(error){await audit(req,action,"environment",environmentId,"denied",{required_access:required});throw error}}
export async function listAgentSecrets(req,environmentId){
  const grant=await authorize(req,environmentId,"READ","agent.secret_list");
  const {rows}=await query(`SELECT s.id,s.name,s.created_at,s.updated_at FROM environment_secrets es JOIN secrets s ON s.id=es.secret_id WHERE es.environment_id=$1 ORDER BY s.name`,[environmentId]);
  await audit(req,"agent.secret_list","environment",environmentId,"success",{project_id:grant.project_id}); return rows;
}
export async function getAgentSecret(req,environmentId,name){
  const grant=await authorize(req,environmentId,"READ","agent.secret_read");
  const {rows}=await query(`SELECT s.* FROM environment_secrets es JOIN secrets s ON s.id=es.secret_id WHERE es.environment_id=$1 AND s.name=$2`,[environmentId,name]);
  if(!rows[0]){await audit(req,"agent.secret_read","environment",environmentId,"denied",{secret_name:name});throw errors.notFound("Secret not found");}
  await audit(req,"agent.secret_read","secret",rows[0].id,"success",{environment_id:environmentId,project_id:grant.project_id}); return {name:rows[0].name,value:decryptSecret(rows[0])};
}
export async function createAgentSecret(req,environmentId,name,value){
  if(!safeName.test(name)||typeof value!=="string"||!value.length||value.length>65536)throw errors.badRequest("Invalid secret name or value");
  const grant=await authorize(req,environmentId,"READ_WRITE","agent.secret_created"),enc=encryptSecret(value);
  const {rows}=await query(`WITH inserted AS (INSERT INTO secrets(project_id,name,ciphertext,nonce,auth_tag,key_version) VALUES($1,$2,$3,$4,$5,$6) RETURNING id,name) INSERT INTO environment_secrets(environment_id,secret_id) SELECT $7,id FROM inserted RETURNING secret_id`,[grant.project_id,name,enc.ciphertext,enc.nonce,enc.authTag,enc.keyVersion,environmentId]);
  await audit(req,"agent.secret_created","secret",rows[0].secret_id,"success",{environment_id:environmentId});return {id:rows[0].secret_id,name};
}
export async function updateAgentSecret(req,environmentId,name,value){
  if(typeof value!=="string"||!value.length||value.length>65536)throw errors.badRequest("Invalid secret value");
  await authorize(req,environmentId,"READ_WRITE","agent.secret_updated");const enc=encryptSecret(value);
  const {rows}=await query(`UPDATE secrets s SET ciphertext=$1,nonce=$2,auth_tag=$3,key_version=$4,updated_at=now() FROM environment_secrets es WHERE es.secret_id=s.id AND es.environment_id=$5 AND s.name=$6 RETURNING s.id,s.name`,[enc.ciphertext,enc.nonce,enc.authTag,enc.keyVersion,environmentId,name]);
  if(!rows[0])throw errors.notFound("Secret not found");await audit(req,"agent.secret_updated","secret",rows[0].id,"success",{environment_id:environmentId});return rows[0];
}
