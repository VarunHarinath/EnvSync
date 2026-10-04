import test from 'node:test';
import assert from 'node:assert/strict';
import {canAccess} from '../Services/resourcePolicy.js';
import {capabilitiesFor} from '../Services/instance.js';
const id='00000000-0000-4000-8000-000000000001';
const user={id:'member',role:'USER',permissions:{read:true,write:true}};
function database(shares=[],attachments=[]) {return {query:async sql=>({rows:sql.includes('resource_shares')?shares:sql.includes('environment_secrets')?attachments:sql.includes('UNION ALL')?[]:[{project_id:'project',created_by:'owner'}]})};}
test('global read/write does not grant unrelated resources',async()=>{assert.equal(await canAccess(user,'secret',id,true,database()),false);assert.equal(await canAccess(user,'project',id,false,database()),false);});
test('project sharing has a read/write ceiling',async()=>{
  const db=database([{resource_type:'project',resource_id:'project',permission:'READ'}]);
  assert.equal(await canAccess(user,'environment',id,false,db),true);
  assert.equal(await canAccess(user,'environment',id,true,db),false);
  assert.equal(await canAccess({...user,permissions:{read:true}},'secret',id,true,database([{resource_type:'project',resource_id:'project',permission:'WRITE'}])),false);
});
test('environment writes cannot mutate secrets shared with unauthorized environments',async()=>{
  const db=database([{resource_type:'environment',resource_id:'dev',permission:'WRITE'}],[{environment_id:'dev'},{environment_id:'prod'}]);
  assert.equal(await canAccess(user,'secret',id,false,db),true);
  assert.equal(await canAccess(user,'secret',id,true,db),false);
});
test('Personal capabilities contain core functionality without team governance',()=>{
  const personal=capabilitiesFor('personal');assert.equal(personal.teamManagement,false);assert.equal(personal.resourceSharing,false);assert.equal(personal.agents,true);
  assert.equal(capabilitiesFor('business').teamManagement,true);assert.equal(capabilitiesFor('personal',false).mcp,false);
});
