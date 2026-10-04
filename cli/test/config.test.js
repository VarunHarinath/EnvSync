import test from 'node:test';
import assert from 'node:assert/strict';
import {validate} from '../lib/runtime.js';
const valid={profile:'personal',port:8088,instanceName:'Test',mcpEnabled:true,apiImage:'example/api@sha256:123',webImage:'example/web:1.0.0',version:'1.0.0',projectName:'envsync-0123456789ab'};
test('valid profiles and image sources are accepted',()=>{assert.equal(validate(valid),valid);assert.equal(validate({...valid,profile:'business'}).profile,'business');});
test('malformed settings and image command injection are rejected',()=>{
  for(const change of [{profile:'enterprise'},{port:80},{port:'8088'},{apiImage:'x\nJWT_SECRET=oops'},{webImage:'$(echo unsafe)'},{mcpEnabled:'false'},{projectName:'../other'},{version:'2.0.0'}])assert.throws(()=>validate({...valid,...change}));
});
test('no image source fails with useful release guidance',()=>{assert.throws(()=>validate({...valid,apiImage:null}),/Registry delivery is not yet configured/);});
